import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"

const REQUEST_INTERVAL = 800
const RECORD_CACHE_TTL = 1000 * 60 * 10
const RETRY_DELAYS = [2000, 4000, 8000, 16000, 24000]

let requestQueue = Promise.resolve()
const recordMapCache = new Map<
  string,
  { cachedAt: number; recordMap: ExtendedRecordMap }
>()
const inflightRecordMapRequests = new Map<string, Promise<ExtendedRecordMap>>()

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const scheduleRequest = async <T>(task: () => Promise<T>) => {
  const nextRequest = requestQueue
    .catch(() => undefined)
    .then(async () => {
      await wait(REQUEST_INTERVAL)
      return task()
    })

  requestQueue = nextRequest.then(
    () => undefined,
    () => undefined
  )

  return nextRequest
}

const isRetryableError = (error: any) => {
  const statusCode = error?.response?.statusCode
  return [429, 500, 502, 503, 504].includes(statusCode)
}

const unwrapTable = (table?: Record<string, any>) => {
  if (!table) {
    return table
  }

  return Object.fromEntries(
    Object.entries(table).map(([key, entry]) => [
      key,
      entry?.value?.value ? { ...entry, value: entry.value.value } : entry,
    ])
  )
}

const normalizeRecordMap = (recordMap: ExtendedRecordMap): ExtendedRecordMap =>
  ({
    ...recordMap,
    block: unwrapTable(recordMap.block),
    collection: unwrapTable(recordMap.collection),
    collection_view: unwrapTable(recordMap.collection_view),
    notion_user: unwrapTable(recordMap.notion_user),
  }) as ExtendedRecordMap

export const getRecordMap = async (pageId: string) => {
  const cachedRecordMap = recordMapCache.get(pageId)
  if (
    cachedRecordMap &&
    Date.now() - cachedRecordMap.cachedAt < RECORD_CACHE_TTL
  ) {
    return cachedRecordMap.recordMap
  }

  const inflightRecordMap = inflightRecordMapRequests.get(pageId)
  if (inflightRecordMap) {
    return inflightRecordMap
  }

  const api = new NotionAPI()

  const request = (async () => {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        const recordMap = await scheduleRequest(() => api.getPage(pageId))
        const normalizedRecordMap = normalizeRecordMap(recordMap)

        recordMapCache.set(pageId, {
          cachedAt: Date.now(),
          recordMap: normalizedRecordMap,
        })

        return normalizedRecordMap
      } catch (error) {
        if (!isRetryableError(error) || attempt === RETRY_DELAYS.length) {
          throw error
        }

        await wait(RETRY_DELAYS[attempt])
      }
    }

    throw new Error(`Failed to fetch recordMap for ${pageId}`)
  })()

  inflightRecordMapRequests.set(pageId, request)

  try {
    return await request
  } finally {
    inflightRecordMapRequests.delete(pageId)
  }
}
