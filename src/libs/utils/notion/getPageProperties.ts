import { getTextContent, getDateValue } from "notion-utils"
import { NotionAPI } from "notion-client"
import { BlockMap, CollectionPropertySchemaMap } from "notion-types"
import { customMapImageUrl } from "./customMapImageUrl"

const getBlockValue = (block: BlockMap, id: string) =>
  (block?.[id]?.value as any)?.value
const userCache = new Map<string, Promise<any>>()
const RETRY_DELAYS = [1000, 2000, 4000]

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isRateLimitError = (error: any) =>
  error?.code === "ERR_NON_2XX_3XX_RESPONSE" &&
  `${error?.message || ""}`.includes("429")

const getUsersWithRetry = async (api: NotionAPI, rawUserId: any) => {
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await api.getUsers(rawUserId)
    } catch (error) {
      if (!isRateLimitError(error) || attempt === RETRY_DELAYS.length) {
        throw error
      }

      await wait(RETRY_DELAYS[attempt])
    }
  }

  return null
}

const getUser = async (api: NotionAPI, rawUserId: any) => {
  const userId = rawUserId?.[1]

  if (!userId) {
    return null
  }

  if (!userCache.has(userId)) {
    userCache.set(
      userId,
      getUsersWithRetry(api, rawUserId).then((res: any) => {
        const resValue = res?.recordMapWithRoles?.notion_user?.[userId]?.value

        if (!resValue) {
          return null
        }

        return {
          id: resValue.id || null,
          name:
            resValue.name ||
            `${resValue.family_name || ""}${resValue.given_name || ""}` ||
            null,
          profile_photo: resValue.profile_photo || null,
        }
      })
    )
  }

  return userCache.get(userId)
}

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
            const user = await getUser(api, rawUsers[j][0])

            if (user) {
              users.push(user)
            }
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
