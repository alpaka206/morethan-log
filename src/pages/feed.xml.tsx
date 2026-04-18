import { GetServerSideProps } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis"
import { joinUrl } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = filterPosts(await getPosts())
  const feedUrl = joinUrl(CONFIG.link, "feed.xml")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(CONFIG.blog.title)}</title>
    <description>${escapeXml(CONFIG.blog.description)}</description>
    <link>${escapeXml(joinUrl(CONFIG.link))}</link>
    <language>${CONFIG.lang}</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.summary || CONFIG.blog.description)}</description>
      <link>${escapeXml(joinUrl(CONFIG.link, post.slug))}</link>
      <guid>${escapeXml(joinUrl(CONFIG.link, post.slug))}</guid>
      <pubDate>${new Date(post.date?.start_date || post.createdTime).toUTCString()}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`

  res.setHeader("Content-Type", "application/xml")
  res.write(rss)
  res.end()

  return {
    props: {},
  }
}

const FeedXmlPage = () => null

export default FeedXmlPage
