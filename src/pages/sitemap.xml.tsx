import { GetServerSideProps } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "../apis/notion-client/getPosts"
import { filterPosts } from "src/libs/utils/notion"
import { joinUrl } from "src/libs/utils"

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const getPostTime = (date?: string) => {
  if (!date) {
    return 0
  }

  const time = Date.parse(date)
  return Number.isNaN(time) ? 0 : time
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = filterPosts(await getPosts(), {
    acceptStatus: ["Public", "PublicOnDetail"],
    acceptType: ["Post", "Paper", "Page"],
  })
  const latestPostTime =
    Math.max(
      ...posts.map((post) =>
        getPostTime(post.date?.start_date || post.createdTime)
      ),
      0
    ) || Date.now()
  const sectionLastmod = new Date(latestPostTime).toISOString()
  const pages = [
    {
      loc: joinUrl(CONFIG.link),
      lastmod: sectionLastmod,
      priority: "1.0",
      changefreq: "daily",
    },
    {
      loc: joinUrl(CONFIG.link, "archive"),
      lastmod: sectionLastmod,
      priority: "0.8",
      changefreq: "weekly",
    },
    {
      loc: joinUrl(CONFIG.link, "tags"),
      lastmod: sectionLastmod,
      priority: "0.7",
      changefreq: "weekly",
    },
    {
      loc: joinUrl(CONFIG.link, "categories"),
      lastmod: sectionLastmod,
      priority: "0.7",
      changefreq: "weekly",
    },
    ...posts.map((post) => ({
      loc: joinUrl(CONFIG.link, post.slug),
      lastmod: new Date(
        getPostTime(post.date?.start_date || post.createdTime) || latestPostTime
      ).toISOString(),
      priority: "0.7",
      changefreq: "daily",
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  res.setHeader("Content-Type", "application/xml")
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${CONFIG.revalidateTime}, stale-while-revalidate=${CONFIG.revalidateTime}`
  )
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

const SitemapPage = () => null

export default SitemapPage
