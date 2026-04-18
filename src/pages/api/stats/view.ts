import { NextApiRequest, NextApiResponse } from "next"
import { trackView } from "src/libs/stats"
import { TStatsSummary } from "src/types"

type ViewResponse =
  | {
      tracked: boolean
      summary: TStatsSummary
    }
  | { message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ViewResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const slug =
    typeof req.body?.slug === "string" && req.body.slug.length
      ? req.body.slug
      : undefined

  try {
    const result = await trackView({ req, slug })
    res.setHeader("Cache-Control", "no-store")
    return res.status(200).json(result)
  } catch (error) {
    console.error("Failed to track page view", error)
    return res.status(500).json({ message: "Failed to track page view" })
  }
}
