import { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"
import { getRecordMap } from "src/apis"

type Data =
  | { recordMap: Awaited<ReturnType<typeof getRecordMap>> }
  | { message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const pageIdParam = req.query.pageId
  const pageId = Array.isArray(pageIdParam) ? pageIdParam[0] : pageIdParam

  if (!pageId) {
    return res.status(400).json({ message: "pageId is required" })
  }

  try {
    const recordMap = await getRecordMap(pageId)

    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${CONFIG.revalidateTime}, stale-while-revalidate=${CONFIG.revalidateTime}`
    )

    return res.status(200).json({ recordMap })
  } catch (error) {
    console.error(`Failed to fetch notion page "${pageId}":`, error)
    return res.status(500).json({ message: "Failed to fetch notion page" })
  }
}
