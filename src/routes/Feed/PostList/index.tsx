import { useRouter } from "next/router"
import React, { useMemo } from "react"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { filterPosts } from "./filterPosts"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()

  const currentTag = Array.isArray(router.query.tag)
    ? router.query.tag[0]
    : `${router.query.tag || ``}` || undefined
  const currentCategory = Array.isArray(router.query.category)
    ? router.query.category[0]
    : `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = Array.isArray(router.query.order)
    ? router.query.order[0]
    : `${router.query.order || ``}` || "desc"

  const filteredPosts = useMemo(
    () =>
      filterPosts({
        posts: data,
        q,
        tag: currentTag,
        category: currentCategory,
        order: currentOrder === "asc" ? "asc" : "desc",
      }),
    [currentCategory, currentOrder, currentTag, data, q]
  )

  return (
    <>
      <div className="my-2">
        {!filteredPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
        )}
        {filteredPosts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </>
  )
}

export default PostList
