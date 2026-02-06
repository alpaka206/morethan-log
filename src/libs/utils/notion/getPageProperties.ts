import { getTextContent, getDateValue } from "notion-utils"
import { NotionAPI } from "notion-client"
import { BlockMap, CollectionPropertySchemaMap } from "notion-types"
import { customMapImageUrl } from "./customMapImageUrl"

const getBlockValue = (block: BlockMap, id: string) =>
  (block?.[id]?.value as any)?.value

async function getPageProperties(
  id: string,
  block: BlockMap,
  schema: CollectionPropertySchemaMap
) {
  const blockValue = getBlockValue(block, id)
  const rawProperties = Object.entries(blockValue?.properties || {})
  const excludeProperties = ["date", "select", "multi_select", "person", "file"]
  const properties: Record<string, any> = { id }

  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i] as [string, any]
    const schemaEntry = schema[key]
    if (!schemaEntry?.type) continue

    if (!excludeProperties.includes(schemaEntry.type)) {
      properties[schemaEntry.name] = getTextContent(val)
      continue
    }

    switch (schemaEntry.type) {
      case "file": {
        try {
          const url: string = val[0][1][0][1]
          properties[schemaEntry.name] = customMapImageUrl(url, blockValue)
        } catch {
          properties[schemaEntry.name] = undefined
        }
        break
      }
      case "date": {
        const dateProperty = getDateValue(val) as any
        delete dateProperty.type
        properties[schemaEntry.name] = dateProperty
        break
      }
      case "select":
      case "multi_select": {
        const selects = getTextContent(val)
        if (selects[0]?.length) {
          properties[schemaEntry.name] = selects.split(",")
        }
        break
      }
      case "person": {
        const api = new NotionAPI()
        const rawUsers = val.flat()
        const users = []
        for (let j = 0; j < rawUsers.length; j++) {
          if (rawUsers[j][0][1]) {
            const userId = rawUsers[j][0]
            const res: any = await api.getUsers(userId)
            const resValue =
              res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
            const user = {
              id: resValue?.id,
              name:
                resValue?.name ||
                `${resValue?.family_name}${resValue?.given_name}` ||
                undefined,
              profile_photo: resValue?.profile_photo || null,
            }
            users.push(user)
          }
        }
        properties[schemaEntry.name] = users
        break
      }
      default:
        break
    }
  }
  return properties
}

export { getPageProperties as default }
