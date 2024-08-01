const CONFIG = {
  // profile setting (required)
  profile: {
    name: "alpaka206",
    image: "/gyuwon.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Frontend Engineer",
    bio: "hello world",
    email: "gyuwon05@gmail.com",
    linkedin: "규원-김-957a6b320",
    github: "alpaka206",
    instagram: "alpaka_dev",
  },
  other: [
    {
      name: `정보처리기사 정리`,
      href: "https://velog.io/@alpaka206/posts",
    },
  ],
  projects: undefined,
  // blog setting (required)
  blog: {
    title: "alpaka206",
    description: "welcome to alpaka206's blog!",
    theme: "light",
  },

  // CONFIG configration (required)
  link: "https://alpaka206.vercel.app/",
  since: 2024, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL:
    "https://og-image-korean.vercel.app/.png?theme=light&md=1&fontSize=175px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-color-logo.svg&images=https%3A%2F%2Fvelog.velcdn.com%2Fimages%2Falpaka206%2Fpost%2Fa32015f8-3d78-453e-873e-363596f774b6%2Fimage.png&images=&widths=0&widths=2000&widths=0&heights=0&heights=1044&heights=0", // The link to generate OG image, don't end with a slash
  seo: {
    keywords: ["alpaka206", "Blog"],
  },

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    // enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }
