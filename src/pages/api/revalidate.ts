import { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from "../../apis"
import { filterPosts } from "src/libs/utils/notion"

const normalizeRevalidatePath = (path: string) => {
  const trimmedPath = path.trim()

  if (!trimmedPath || trimmedPath.includes("://") || trimmedPath.includes("..")) {
    return null
  }

  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { secret, path } = req.query

  if (!process.env.TOKEN_FOR_REVALIDATE || secret !== process.env.TOKEN_FOR_REVALIDATE) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    if (path && typeof path === "string") {
      const normalizedPath = normalizeRevalidatePath(path)

      if (!normalizedPath) {
        return res.status(400).json({ message: "Invalid path" })
      }

      await res.revalidate(normalizedPath)
    } else {
      const posts = filterPosts(await getPosts(), {
        acceptStatus: ["Public", "PublicOnDetail"],
        acceptType: ["Paper", "Post", "Page"],
      })
      await res.revalidate("/")
      const revalidateRequests = posts.map((row) =>
        res.revalidate(`/${row.slug}`)
      )
      await Promise.all(revalidateRequests)
    }

    res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send("Error revalidating")
  }
}
