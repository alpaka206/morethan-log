type DateLocale = Intl.LocalesArgument

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "")

export function joinUrl(baseUrl: string, path = "") {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const normalizedPath = path.replace(/^\/+/, "")

  if (!normalizedPath) {
    return normalizedBaseUrl
  }

  return `${normalizedBaseUrl}/${normalizedPath}`
}

export function formatDate(date: string | number | Date, locale: DateLocale) {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }

  return d.toLocaleDateString(locale, options)
}
