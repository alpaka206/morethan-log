import Detail from "src/routes/Detail"
import { filterPosts } from "src/libs/utils/notion"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"
import { PostDetail } from "src/types"
import { joinUrl } from "src/libs/utils"

const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

const PREBUILT_POST_COUNT = 20

type DetailPageProps = {
  post: PostDetail | null
  pageLinkMap: Record<string, string>
}

export const getStaticPaths = async () => {
  const posts = await getPosts()
  const filteredPost = filterPosts(posts, filter)
  const staticPosts = [
    ...filteredPost.filter((post) => post.type[0] !== "Post"),
    ...filteredPost
      .filter((post) => post.type[0] === "Post")
      .slice(0, PREBUILT_POST_COUNT),
  ]

  return {
    paths: staticPosts.map((row) => `/${row.slug}`),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<DetailPageProps> = async (context) => {
  const slugParam = context.params?.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  try {
    const posts = await getPosts()
    const detailPosts = filterPosts(posts, filter)
    const postDetail = detailPosts.find((t) => t.slug === slug)
    const pageLinkMap = Object.fromEntries(
      detailPosts.flatMap((post) => [
        [post.id, post.slug],
        [post.id.replace(/-/g, ""), post.slug],
      ])
    )

    if (!postDetail) {
      return { notFound: true }
    }

    return {
      props: {
        post: postDetail,
        pageLinkMap,
      },
      revalidate: CONFIG.revalidateTime,
    }
  } catch (error) {
    console.error(`Failed to build page "/${slug}":`, error)
    throw error
  }
}

const DetailPage: NextPageWithLayout<DetailPageProps> = ({ post, pageLinkMap }) => {
  if (!post) return <CustomError />

  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`

  const date = post.date?.start_date || post.createdTime || ""

  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image: image,
    description: post.summary || "",
    type: post.type[0],
    url: joinUrl(CONFIG.link, post.slug),
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Detail data={post} pageLinkMap={pageLinkMap} />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
