import { CONFIG } from "site.config"
import Head from "next/head"
import { joinUrl } from "src/libs/utils"

type MetaConfigProps = {
  title: string
  description: string
  type: "Website" | "Post" | "Page" | string
  date?: string
  modifiedDate?: string
  image?: string
  imageAlt?: string
  url: string
  keywords?: string[]
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>
}

const MetaConfig: React.FC<MetaConfigProps> = (props) => {
  const isPost = props.type.toLowerCase() === "post"
  const ogType = isPost ? "article" : "website"
  const description = props.description.trim() || CONFIG.blog.description
  const imageAlt = props.imageAlt || props.title
  const modifiedDate = props.modifiedDate || props.date
  const keywords =
    props.keywords && props.keywords.length > 0
      ? props.keywords
      : CONFIG.seo.keywords || []
  const structuredData = Array.isArray(props.structuredData)
    ? props.structuredData
    : props.structuredData
      ? [props.structuredData]
      : []

  return (
    <Head>
      <title>{props.title}</title>
      <meta name="robots" content="follow, index" />
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <link rel="canonical" href={props.url} />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${CONFIG.blog.title} RSS Feed`}
        href={joinUrl(CONFIG.link, "feed.xml")}
      />
      {/* og */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={CONFIG.blog.title} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={props.url} />
      {CONFIG.lang && <meta property="og:locale" content={CONFIG.lang} />}
      {props.image && <meta property="og:image" content={props.image} />}
      {props.image && <meta property="og:image:alt" content={imageAlt} />}
      {/* twitter */}
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      {props.image && <meta name="twitter:image" content={props.image} />}
      {props.image && <meta name="twitter:image:alt" content={imageAlt} />}
      {/* post */}
      {isPost && (
        <>
          {props.date && (
            <meta property="article:published_time" content={props.date} />
          )}
          {modifiedDate && (
            <meta property="article:modified_time" content={modifiedDate} />
          )}
          <meta property="article:author" content={CONFIG.profile.name} />
          {keywords.map((keyword) => (
            <meta key={keyword} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      {structuredData.map((item, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  )
}

export default MetaConfig
