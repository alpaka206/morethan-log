require("dotenv").config()

const { integrations, profile, projects, seo, site } = require("./config")

const CONFIG = {
  profile,
  projects,
  blog: {
    title: site.title,
    description: site.description,
    theme: site.theme,
  },

  // core site config
  link: site.url,
  since: site.since,
  lang: site.lang,
  ogImageGenerateURL: site.ogImageGenerateURL,
  seo,

  // notion configuration
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // integrations
  googleAnalytics: {
    enable: integrations.googleAnalytics.enable,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: integrations.googleSearchConsole.enable,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: integrations.naverSearchAdvisor.enable,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable:
      integrations.utterances.enable &&
      Boolean(process.env.NEXT_PUBLIC_UTTERANCES_REPO),
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      label: integrations.utterances.label,
    },
  },
  cusdis: {
    enable: integrations.cusdis.enable,
    config: {
      host: integrations.cusdis.host,
      appid: integrations.cusdis.appid,
    },
  },

  isProd: process.env.VERCEL_ENV === "production",
  revalidateTime: 21600 * 7,
}

module.exports = { CONFIG }
