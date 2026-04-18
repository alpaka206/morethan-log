import { NextApiRequest, NextApiResponse } from "next"
import { getStatsSummary } from "src/libs/stats"
import { TStatsSummary } from "src/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TStatsSummary | { message: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const slugParam = req.query.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  try {
    const summary = await getStatsSummary(slug)
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    return res.status(200).json(summary)
  } catch (error) {
    console.error("Failed to fetch stats summary", error)
    return res.status(500).json({ message: "Failed to fetch stats summary" })
  }
}
