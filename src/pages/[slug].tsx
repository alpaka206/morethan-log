import { GetStaticProps } from "next"
import { CONFIG } from "site.config"
import { getPosts, getRecordMap } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import {
  buildOgImageUrl,
  getAdjacentPosts,
  getPostReadTime,
  getPostTableOfContents,
  getRelatedPosts,
  joinUrl,
} from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"
import Detail from "src/routes/Detail"
import CustomError from "src/routes/Error"
import {
  NextPageWithLayout,
  PostDetail,
  TAdjacentPosts,
  TInitialRecordMap,
  TPost,
  TTableOfContents,
} from "src/types"

const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

const PREBUILT_POST_COUNT = 20
const INLINE_RECORD_MAP_LIMIT = 120_000

type DetailPageProps = {
  post: PostDetail | null
  pageLinkMap: Record<string, string>
  tableOfContents: TTableOfContents
  readTime: string | null
  adjacentPosts: TAdjacentPosts
  relatedPosts: TPost[]
  initialRecordMap: TInitialRecordMap
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

export const getStaticProps: GetStaticProps<DetailPageProps> = async (
  context
) => {
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

    let tableOfContents: TTableOfContents = []
    let readTime: string | null = null
    let adjacentPosts: TAdjacentPosts = { prev: null, next: null }
    let relatedPosts: TPost[] = []
    let initialRecordMap: TInitialRecordMap = null

    try {
      const recordMap = await getRecordMap(postDetail.id)
      tableOfContents = getPostTableOfContents(recordMap, postDetail.id)
      readTime =
        postDetail.type[0] === "Post"
          ? getPostReadTime(recordMap, postDetail.id)
          : null
      if (
        Buffer.byteLength(JSON.stringify(recordMap), "utf8") <=
        INLINE_RECORD_MAP_LIMIT
      ) {
        initialRecordMap = recordMap
      }
    } catch (error) {
      console.error(`Failed to prefetch recordMap for "/${slug}":`, error)
    }

    if (postDetail.type[0] === "Post") {
      adjacentPosts = getAdjacentPosts(detailPosts, postDetail)
      relatedPosts = getRelatedPosts(detailPosts, postDetail)
    }

    return {
      props: {
        post: postDetail,
        pageLinkMap,
        tableOfContents,
        readTime,
        adjacentPosts,
        relatedPosts,
        initialRecordMap,
      },
      revalidate: CONFIG.revalidateTime,
    }
  } catch (error) {
    console.error(`Failed to build page "/${slug}":`, error)
    throw error
  }
}

const DetailPage: NextPageWithLayout<DetailPageProps> = ({
  post,
  pageLinkMap,
  tableOfContents,
  readTime,
  adjacentPosts,
  relatedPosts,
  initialRecordMap,
}) => {
  if (!post) return <CustomError />

  const image = post.thumbnail ?? buildOgImageUrl(post.title)
  const date = post.date?.start_date || post.createdTime || ""
  const category = post.category?.[0]
  const keywords = [...(post.tags || []), ...(category ? [category] : [])]
  const url = joinUrl(CONFIG.link, post.slug)

  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image,
    description: post.summary || "",
    type: post.type[0],
    url,
    keywords,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: CONFIG.blog.title,
            item: joinUrl(CONFIG.link),
          },
          ...(category
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: category,
                  item: `${joinUrl(CONFIG.link, "categories")}#${encodeURIComponent(category)}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: category ? 3 : 2,
            name: post.title,
            item: url,
          },
        ],
      },
      post.type[0] === "Post"
        ? {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary || CONFIG.blog.description,
            image: image ? [image] : undefined,
            datePublished: new Date(date).toISOString(),
            author: {
              "@type": "Person",
              name: post.author?.[0]?.name || CONFIG.profile.name,
            },
            publisher: {
              "@type": "Person",
              name: CONFIG.profile.name,
              image: CONFIG.profile.image,
            },
            mainEntityOfPage: url,
            articleSection: category,
            keywords: keywords.join(", "),
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: post.title,
            description: post.summary || CONFIG.blog.description,
            url,
          },
    ],
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Detail
        data={post}
        pageLinkMap={pageLinkMap}
        tableOfContents={tableOfContents}
        readTime={readTime}
        adjacentPosts={adjacentPosts}
        relatedPosts={relatedPosts}
        initialRecordMap={initialRecordMap}
      />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
