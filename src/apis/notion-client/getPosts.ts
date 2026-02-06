import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"
import { BlockMap } from "notion-types"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

const getBlockValue = (block: BlockMap, id: string) =>
  (block?.[id]?.value as any)?.value

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const response = await api.getPage(id)
  id = idToUuid(id)
  const collection = (Object.values(response.collection)[0]?.value as any)
  const block = response.block
  const schema = collection?.value?.schema

  const rawMetadata = getBlockValue(block, id)

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  }

  // Construct Data
  const pageIds = getAllPageIds(response)
  const data = []
  for (let i = 0; i < pageIds.length; i++) {
    const pageId = pageIds[i]
    const properties = (await getPageProperties(pageId, block, schema)) || null
    const blockValue = getBlockValue(block, pageId)
    // Add fullwidth, createdtime to properties
    properties.createdTime = new Date(blockValue?.created_time).toString()
    properties.fullWidth = blockValue?.format?.page_full_width ?? false

    data.push(properties)
  }

  // Sort by date
  data.sort((a: any, b: any) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b?.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })

  return data as TPosts
}
