import { useQuery } from "@tanstack/react-query"
import { ExtendedRecordMap } from "notion-types"
import { queryKey } from "src/constants/queryKey"

type RecordMapResponse = {
  recordMap: ExtendedRecordMap
}

const fetchRecordMap = async (pageId: string) => {
  const response = await fetch(`/api/notion/${pageId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch recordMap for ${pageId}`)
  }

  const data = (await response.json()) as RecordMapResponse
  return data.recordMap
}

const createRecordMapQueryOptions = (pageId: string) => ({
  queryKey: queryKey.recordMap(pageId),
  queryFn: () => fetchRecordMap(pageId),
  staleTime: 1000 * 60 * 10,
  cacheTime: 1000 * 60 * 30,
  retry: 2,
})

const useRecordMapQuery = (
  pageId: string,
  options?: { initialData?: ExtendedRecordMap | null }
) =>
  useQuery({
    ...createRecordMapQueryOptions(pageId),
    initialData: options?.initialData || undefined,
    enabled: typeof window !== "undefined" && Boolean(pageId),
  })

export default useRecordMapQuery
