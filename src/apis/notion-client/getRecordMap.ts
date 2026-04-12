import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"

const REQUEST_INTERVAL = 350
const RETRY_DELAYS = [1000, 2000, 4000]

let requestQueue = Promise.resolve()

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

const isRateLimitError = (error: any) =>
  error?.code === "ERR_NON_2XX_3XX_RESPONSE" &&
  `${error?.message || ""}`.includes("429")

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

const normalizeRecordMap = (recordMap: ExtendedRecordMap) => ({
  ...recordMap,
  block: unwrapTable(recordMap.block),
  collection: unwrapTable(recordMap.collection),
  collection_view: unwrapTable(recordMap.collection_view),
  notion_user: unwrapTable(recordMap.notion_user),
})

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const recordMap = await scheduleRequest(() => api.getPage(pageId))
      return normalizeRecordMap(recordMap)
    } catch (error) {
      if (!isRateLimitError(error) || attempt === RETRY_DELAYS.length) {
        throw error
      }

      await wait(RETRY_DELAYS[attempt])
    }
  }

  throw new Error(`Failed to fetch recordMap for ${pageId}`)
}
