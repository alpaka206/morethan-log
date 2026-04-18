export const queryKey = {
  scheme: () => ["scheme"],
  posts: () => ["posts"],
  tags: () => ["tags"],
  categories: () => ["categories"],
  statsSummary: (slug?: string) => ["statsSummary", slug || "site"],
  post: (slug: string) => ["post", slug],
  recordMap: (pageId: string) => ["recordMap", pageId],
}
