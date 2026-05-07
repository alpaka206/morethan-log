import { idToUuid } from "notion-utils"
import { ExtendedRecordMap, ID } from "notion-types"

type CollectionQueryView = {
  blockIds?: ID[]
  collection_group_results?: {
    blockIds?: ID[]
  }
  reducerResults?: {
    collection_group_results?: {
      blockIds?: ID[]
    }
  }
}

type CollectionViewEntry = {
  value?: {
    value?: {
      page_sort?: ID[]
    }
  }
}

export default function getAllPageIds(
  response: ExtendedRecordMap,
  viewId?: string
) {
  const collectionQuery = Object.values(response.collection_query || {})[0] as
    | Record<string, CollectionQueryView>
    | undefined
  const collectionViews = (response.collection_view ||
    {}) as Record<string, CollectionViewEntry>
  const getFallbackPageIds = (targetViewId?: string) => {
    const pageSet = new Set<ID>()

    Object.entries(collectionViews).forEach(([key, entry]) => {
      if (targetViewId && key !== targetViewId) return

      entry?.value?.value?.page_sort?.forEach((id: ID) => pageSet.add(id))
    })

    return [...pageSet]
  }

  let pageIds: ID[] = []
  if (collectionQuery && Object.keys(collectionQuery).length) {
    if (viewId) {
      const vId = idToUuid(viewId)
      pageIds =
        collectionQuery[vId]?.blockIds ||
        collectionQuery[vId]?.collection_group_results?.blockIds ||
        collectionQuery[vId]?.reducerResults?.collection_group_results
          ?.blockIds ||
        []
    } else {
      const pageSet = new Set<ID>()

      Object.values(collectionQuery).forEach((view) => {
        const blockIds =
          view?.blockIds ||
          view?.collection_group_results?.blockIds ||
          view?.reducerResults?.collection_group_results?.blockIds

        blockIds?.forEach((id: ID) => pageSet.add(id))
      })
      pageIds = [...pageSet]
    }
  } else {
    pageIds = getFallbackPageIds(viewId ? idToUuid(viewId) : undefined)
  }

  return pageIds
}
