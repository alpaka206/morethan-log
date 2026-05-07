import { CONFIG } from "site.config"
const GA_TRACKING_ID = CONFIG.googleAnalytics.config.measurementId

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "object") return
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}
