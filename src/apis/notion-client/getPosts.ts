import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"
import { BlockMap, ExtendedRecordMap } from "notion-types"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

const getBlockValue = (block: BlockMap, id: string) =>
  (block?.[id]?.value as any)?.value
const POSTS_CACHE_TTL = 1000 * 60 * 30
const RETRY_DELAYS = [2000, 4000, 8000, 16000, 24000]

let cachedPosts: TPosts | null = null
let cachedAt = 0
let inflightPostsRequest: Promise<TPosts> | null = null

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isRetryableError = (error: any) => {
  const statusCode = error?.response?.statusCode
  return [429, 500, 502, 503, 504].includes(statusCode)
}

const withRetry = async <T>(task: () => Promise<T>) => {
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await task()
    } catch (error) {
      if (!isRetryableError(error) || attempt === RETRY_DELAYS.length) {
        throw error
      }

      await wait(RETRY_DELAYS[attempt])
    }
  }

  throw new Error("Failed to complete Notion request")
}

const hydrateCollectionRecordMap = async (
  api: NotionAPI,
  response: ExtendedRecordMap
) => {
  if (Object.keys(response.collection_query || {}).length) {
    return response.block
  }

  const collection = Object.values(response.collection || {})[0]?.value as any
  const collectionView = Object.values(response.collection_view || {})[0]
    ?.value as any
  const collectionId = collection?.value?.id
  const view = collectionView?.value
  const viewId = view?.id

  if (!collectionId || !viewId || !view) {
    return response.block
  }

  const collectionData = await withRetry(() =>
    api.getCollectionData(collectionId, viewId, view, {
      limit: 9999,
      searchQuery: "",
      userTimeZone: "Asia/Seoul",
    })
  )

  response.block = {
    ...response.block,
    ...(collectionData.recordMap?.block || {}),
  }

  return response.block
}

export const getPosts = async () => {
  if (cachedPosts && Date.now() - cachedAt < POSTS_CACHE_TTL) {
    return cachedPosts
  }

  if (inflightPostsRequest) {
    return inflightPostsRequest
  }

  inflightPostsRequest = (async () => {
    let id = CONFIG.notionConfig.pageId as string
    const api = new NotionAPI()

    const response = await withRetry(() => api.getPage(id))
    id = idToUuid(id)
    const collection = Object.values(response.collection)[0]?.value as any
    const block = await hydrateCollectionRecordMap(api, response)
    const schema = collection?.value?.schema

    const rawMetadata = getBlockValue(block, id)

    if (
      rawMetadata?.type !== "collection_view_page" &&
      rawMetadata?.type !== "collection_view"
    ) {
      return []
    }

    const pageIds = getAllPageIds(response)
    const data = []

    for (let i = 0; i < pageIds.length; i++) {
      const pageId = pageIds[i]
      const properties = (await getPageProperties(pageId, block, schema)) || null
      const blockValue = getBlockValue(block, pageId)

      properties.createdTime = new Date(
        blockValue?.created_time || Date.now()
      ).toISOString()
      properties.fullWidth = blockValue?.format?.page_full_width ?? false

      data.push(properties)
    }

    data.sort((a: any, b: any) => {
      const dateA = new Date(a?.date?.start_date || a.createdTime).getTime()
      const dateB = new Date(b?.date?.start_date || b.createdTime).getTime()
      return dateB - dateA
    })

    const sanitizedPosts = JSON.parse(JSON.stringify(data)) as TPosts

    cachedPosts = sanitizedPosts
    cachedAt = Date.now()

    return sanitizedPosts
  })()

  try {
    return await inflightPostsRequest
  } finally {
    inflightPostsRequest = null
  }
}
