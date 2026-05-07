import { NextPage } from "next"
import { AppProps } from "next/app"
import { DehydratedState } from "@tanstack/react-query"
import { ExtendedRecordMap } from "notion-types"
import { ReactElement, ReactNode } from "react"
import { TableOfContentsEntry } from "notion-utils"

export type NextPageWithLayout<PageProps = {}> = NextPage<PageProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export type PagePropsWithDehydratedState = {
  dehydratedState?: DehydratedState
}

export type TPostStatus = "Private" | "Public" | "PublicOnDetail"
export type TPostType = "Post" | "Paper" | "Page"

export type TPost = {
  id: string
  date?: { start_date?: string }
  type: TPostType[]
  slug: string
  tags?: string[]
  category?: string[]
  summary?: string
  author?: {
    id: string | null
    name: string | null
    profile_photo?: string | null
  }[]
  title: string
  status: TPostStatus[]
  createdTime: string
  fullWidth: boolean
  thumbnail?: string
}

export type PostDetail = TPost

export type TPosts = TPost[]

export type TTags = {
  [tagName: string]: number
}
export type SchemeType = "light" | "dark"

export type TTableOfContents = TableOfContentsEntry[]

export type TAdjacentPosts = {
  prev: TPost | null
  next: TPost | null
}

export type TInitialRecordMap = ExtendedRecordMap | null
