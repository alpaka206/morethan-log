import { getTextContent, getDateValue } from "notion-utils"
import { NotionAPI } from "notion-client"
import { Block, BlockMap, CollectionPropertySchemaMap } from "notion-types"
import { customMapImageUrl } from "./customMapImageUrl"

type NotionBlockValue = Block & {
  properties?: Record<string, unknown>
}

type NotionUser = {
  id: string | null
  name: string | null
  profile_photo: string | null
}

type NotionUserResponse = {
  recordMapWithRoles?: {
    notion_user?: Record<
      string,
      {
        value?: {
          id?: string
          name?: string
          family_name?: string
          given_name?: string
          profile_photo?: string
        }
      }
    >
  }
}

type RawNotionUserId = Parameters<NotionAPI["getUsers"]>[0]
type PageProperties = Record<string, unknown> & { id: string }

const getBlockValue = (block: BlockMap, id: string) =>
  (block?.[id]?.value as { value?: NotionBlockValue } | undefined)?.value
const userCache = new Map<string, Promise<NotionUser | null>>()
const RETRY_DELAYS = [1000, 2000, 4000]

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isRateLimitError = (error: unknown) => {
  const typedError = error as { code?: string; message?: string }
  return (
    typedError.code === "ERR_NON_2XX_3XX_RESPONSE" &&
    `${typedError.message || ""}`.includes("429")
  )
}

const getUsersWithRetry = async (
  api: NotionAPI,
  rawUserId: RawNotionUserId
) => {
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await api.getUsers(rawUserId)
    } catch (error) {
      if (!isRateLimitError(error) || attempt === RETRY_DELAYS.length) {
        throw error
      }

      await wait(RETRY_DELAYS[attempt]!)
    }
  }

  return null
}

const getUser = async (api: NotionAPI, rawUserId: RawNotionUserId) => {
  const userId = Array.isArray(rawUserId) ? rawUserId[1] : null

  if (typeof userId !== "string") {
    return null
  }

  if (!userCache.has(userId)) {
    userCache.set(
      userId,
      getUsersWithRetry(api, rawUserId).then((res) => {
        const typedResponse = res as NotionUserResponse | null
        const resValue =
          typedResponse?.recordMapWithRoles?.notion_user?.[userId]?.value

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
  const properties: PageProperties = { id }

  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i] as [string, unknown]
    const schemaEntry = schema[key]
    if (!schemaEntry?.type) continue

    if (!excludeProperties.includes(schemaEntry.type)) {
      properties[schemaEntry.name] = getTextContent(
        val as Parameters<typeof getTextContent>[0]
      )
      continue
    }

    switch (schemaEntry.type) {
      case "file": {
        try {
          const url = (
            (((val as unknown[])?.[0] as unknown[])?.[1] as unknown[])?.[0] as
              | unknown[]
              | undefined
          )?.[1]

          if (typeof url !== "string") {
            throw new Error("Invalid Notion file URL")
          }

          if (!blockValue) {
            throw new Error("Missing Notion block")
          }

          properties[schemaEntry.name] = customMapImageUrl(url, blockValue)
        } catch {
          properties[schemaEntry.name] = undefined
        }
        break
      }
      case "date": {
        const dateValue = getDateValue(
          val as Parameters<typeof getDateValue>[0]
        ) as unknown

        if (dateValue && typeof dateValue === "object") {
          const dateProperty = { ...(dateValue as Record<string, unknown>) }
          delete dateProperty.type
          properties[schemaEntry.name] = dateProperty
        }
        break
      }
      case "select":
      case "multi_select": {
        const selects = getTextContent(
          val as Parameters<typeof getTextContent>[0]
        )
        if (selects[0]?.length) {
          properties[schemaEntry.name] = selects.split(",")
        }
        break
      }
      case "person": {
        const api = new NotionAPI()
        const rawUsers = Array.isArray(val) ? val.flat() : []
        const users: NotionUser[] = []
        for (let j = 0; j < rawUsers.length; j++) {
          const rawUser = rawUsers[j]
          const rawUserId = Array.isArray(rawUser) ? rawUser[0] : null

          if (Array.isArray(rawUserId) && rawUserId[1]) {
            const user = await getUser(api, rawUserId)

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
