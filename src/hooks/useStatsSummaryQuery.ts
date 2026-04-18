import { useQuery } from "@tanstack/react-query"
import { queryKey } from "src/constants/queryKey"
import { TStatsSummary } from "src/types"

export const fetchStatsSummary = async (slug?: string) => {
  const query = slug ? `?slug=${encodeURIComponent(slug)}` : ""
  const response = await fetch(`/api/stats/summary${query}`)

  if (!response.ok) {
    throw new Error("Failed to fetch stats summary")
  }

  return (await response.json()) as TStatsSummary
}

const useStatsSummaryQuery = (slug?: string) =>
  useQuery({
    queryKey: queryKey.statsSummary(slug),
    queryFn: () => fetchStatsSummary(slug),
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
  })

export default useStatsSummaryQuery
