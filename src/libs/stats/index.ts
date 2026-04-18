import { createHash } from "crypto"
import { NextApiRequest } from "next"
import { Redis } from "@upstash/redis"
import { TStatsSummary } from "src/types"

const BOT_PATTERN =
  /bot|spider|crawler|preview|facebookexternalhit|Slackbot|Twitterbot|bingbot|AhrefsBot|SemrushBot|HeadlessChrome/i

let redisClient: Redis | null | undefined

const createEmptySummary = (): TStatsSummary => ({
  enabled: false,
  site: {
    views: 0,
    visitors: 0,
  },
})

const isStatsEnabled = () =>
  Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )

const getRedis = () => {
  if (!isStatsEnabled()) {
    return null
  }

  if (redisClient === undefined) {
    redisClient = Redis.fromEnv()
  }

  return redisClient
}

const getSiteViewsKey = () => "stats:site:views"
const getSiteVisitorsKey = () => "stats:site:visitors"
const getPostViewsKey = (slug: string) => `stats:post:${slug}:views`
const getPostVisitorsKey = (slug: string) => `stats:post:${slug}:visitors`

const getVisitorHash = (req: NextApiRequest) => {
  const forwardedFor = `${req.headers["x-forwarded-for"] || ""}`
  const ip = forwardedFor.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown"
  const userAgent = `${req.headers["user-agent"] || "unknown"}`
  const salt = process.env.STATS_SALT || "morethan-log"

  return createHash("sha256")
    .update([ip, userAgent, salt].join(":"))
    .digest("hex")
}

export const shouldTrackRequest = (req: NextApiRequest) => {
  const userAgent = `${req.headers["user-agent"] || ""}`
  const purpose = `${req.headers.purpose || ""}`
  const secPurpose = `${req.headers["sec-purpose"] || ""}`

  if (!userAgent || BOT_PATTERN.test(userAgent)) {
    return false
  }

  if (
    purpose.toLowerCase().includes("prefetch") ||
    secPurpose.toLowerCase().includes("prefetch")
  ) {
    return false
  }

  return true
}

export const getStatsSummary = async (slug?: string): Promise<TStatsSummary> => {
  const redis = getRedis()

  if (!redis) {
    return createEmptySummary()
  }

  const [siteViews, siteVisitors, postViews, postVisitors] = await Promise.all([
    redis.get<number>(getSiteViewsKey()),
    redis.scard(getSiteVisitorsKey()),
    slug ? redis.get<number>(getPostViewsKey(slug)) : Promise.resolve(0),
    slug ? redis.scard(getPostVisitorsKey(slug)) : Promise.resolve(0),
  ])

  return {
    enabled: true,
    site: {
      views: Number(siteViews || 0),
      visitors: Number(siteVisitors || 0),
    },
    post: slug
      ? {
          views: Number(postViews || 0),
          visitors: Number(postVisitors || 0),
        }
      : undefined,
  }
}

export const trackView = async ({
  req,
  slug,
}: {
  req: NextApiRequest
  slug?: string
}) => {
  const redis = getRedis()

  if (!redis || !shouldTrackRequest(req)) {
    return {
      tracked: false,
      summary: await getStatsSummary(slug),
    }
  }

  const visitorHash = getVisitorHash(req)
  const operations: Promise<unknown>[] = [
    redis.incr(getSiteViewsKey()),
    redis.sadd(getSiteVisitorsKey(), visitorHash),
  ]

  if (slug) {
    operations.push(redis.incr(getPostViewsKey(slug)))
    operations.push(redis.sadd(getPostVisitorsKey(slug), visitorHash))
  }

  await Promise.all(operations)

  return {
    tracked: true,
    summary: await getStatsSummary(slug),
  }
}
