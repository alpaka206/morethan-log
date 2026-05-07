import { DEFAULT_CATEGORY } from "src/constants"
import { TPost } from "src/types"

interface FilterPostsParams {
  posts: TPost[]
  q: string
  tag?: string
  category?: string
  order?: "asc" | "desc"
}

export function filterPosts({
  posts,
  q,
  tag,
  category = DEFAULT_CATEGORY,
  order = "desc",
}: FilterPostsParams): TPost[] {
  const normalizedQuery = q.trim().toLowerCase()

  return posts
    .filter((post) => {
      const tagContent = post.tags ? post.tags.join(" ") : ""
      const searchContent = [post.title, post.summary || "", tagContent]
        .join(" ")
        .toLowerCase()

      return (
        searchContent.includes(normalizedQuery) &&
        (!tag || (post.tags && post.tags.includes(tag))) &&
        (category === DEFAULT_CATEGORY ||
          (post.category && post.category.includes(category)))
      )
    })
    .sort((a, b) => {
      const dateA = new Date(a.date?.start_date || a.createdTime).getTime()
      const dateB = new Date(b.date?.start_date || b.createdTime).getTime()
      return order === "desc" ? dateB - dateA : dateA - dateB
    })
}
