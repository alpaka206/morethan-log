import {
  getPageTableOfContents,
  TableOfContentsEntry,
} from "notion-utils"
import { ExtendedRecordMap, PageBlock } from "notion-types"
import { CONFIG } from "site.config"
import { TAdjacentPosts, TPost, TPosts } from "src/types"
import { joinUrl } from "./index"

const OG_TITLE_PLACEHOLDERS = [/\{title\}/g, /\{\{title\}\}/g]

export const getPostDateValue = (post: TPost) =>
  new Date(post.date?.start_date || post.createdTime).getTime()

export const sortPostsByDate = (posts: TPosts) =>
  [...posts].sort((a, b) => getPostDateValue(b) - getPostDateValue(a))

export const buildOgImageUrl = (title: string) => {
  const template = CONFIG.ogImageGenerateURL

  if (!template) {
    return undefined
  }

  const encodedTitle = encodeURIComponent(title)
  const matchedPlaceholder = OG_TITLE_PLACEHOLDERS.find((pattern) =>
    pattern.test(template)
  )

  if (matchedPlaceholder) {
    return template.replace(matchedPlaceholder, encodedTitle)
  }

  return template
}

const getPageBlock = (recordMap: ExtendedRecordMap, pageId: string) => {
  const pageBlock =
    (recordMap.block?.[pageId]?.value as PageBlock | undefined) ||
    (recordMap.block?.[pageId.replace(/-/g, "")]?.value as
      | PageBlock
      | undefined)

  if (pageBlock) {
    return pageBlock
  }

  const [firstBlockId] = Object.keys(recordMap.block || {})
  return (recordMap.block?.[firstBlockId]?.value as PageBlock | undefined) || null
}

export const getPostTableOfContents = (
  recordMap: ExtendedRecordMap,
  pageId: string
): TableOfContentsEntry[] => {
  const pageBlock = getPageBlock(recordMap, pageId)

  if (!pageBlock) {
    return []
  }

  return getPageTableOfContents(pageBlock, recordMap)
}

export const getAdjacentPosts = (posts: TPosts, targetPost: TPost): TAdjacentPosts => {
  const sortedPosts = sortPostsByDate(
    posts.filter((post) => post.type[0] === "Post")
  )
  const currentIndex = sortedPosts.findIndex((post) => post.id === targetPost.id)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: sortedPosts[currentIndex + 1] || null,
    next: sortedPosts[currentIndex - 1] || null,
  }
}

const getSimilarityScore = (sourcePost: TPost, targetPost: TPost) => {
  if (sourcePost.id === targetPost.id) {
    return -1
  }

  let score = 0
  const sourceCategory = sourcePost.category?.[0]
  const targetCategory = targetPost.category?.[0]

  if (sourceCategory && sourceCategory === targetCategory) {
    score += 5
  }

  const sourceTags = new Set(sourcePost.tags || [])
  const targetTags = targetPost.tags || []
  targetTags.forEach((tag) => {
    if (sourceTags.has(tag)) {
      score += 2
    }
  })

  score += Math.max(0, 3 - Math.abs(getPostDateValue(sourcePost) - getPostDateValue(targetPost)) / (1000 * 60 * 60 * 24 * 30))

  return score
}

export const getRelatedPosts = (
  posts: TPosts,
  targetPost: TPost,
  limit = 3
) =>
  sortPostsByDate(
    posts.filter((post) => post.type[0] === "Post" && post.id !== targetPost.id)
  )
    .map((post) => ({
      post,
      score: getSimilarityScore(targetPost, post),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || getPostDateValue(b.post) - getPostDateValue(a.post))
    .slice(0, limit)
    .map(({ post }) => post)

export const groupPostsByYear = (posts: TPosts) => {
  const grouped = new Map<string, TPosts>()

  sortPostsByDate(posts).forEach((post) => {
    const year = `${new Date(post.date?.start_date || post.createdTime).getFullYear()}`
    grouped.set(year, [...(grouped.get(year) || []), post])
  })

  return grouped
}

export const buildPostUrl = (slug: string) => joinUrl(CONFIG.link, slug)

export const normalizeQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || ""
