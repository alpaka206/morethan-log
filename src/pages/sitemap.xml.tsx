import { getPosts } from "../apis/notion-client/getPosts"
import { CONFIG } from "site.config"
import { getServerSideSitemap, ISitemapField } from "next-sitemap"
import { GetServerSideProps } from "next"
import { joinUrl } from "src/libs/utils"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = await getPosts()
  const dynamicPaths = posts.map((post) => ({
    loc: joinUrl(CONFIG.link, post.slug),
    lastmod: post.date?.start_date || post.createdTime,
  }))

  // Create an array of fields, each with a loc and lastmod
  const fields: ISitemapField[] = dynamicPaths.map((path) => ({
    loc: path.loc,
    lastmod: new Date(path.lastmod).toISOString(),
    priority: 0.7,
    changefreq: "daily",
  }))

  // Include the site root separately
  fields.unshift({
    loc: joinUrl(CONFIG.link),
    lastmod: new Date().toISOString(),
    priority: 1.0,
    changefreq: "daily",
  })

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
const SitemapPage = () => {}
export default SitemapPage
