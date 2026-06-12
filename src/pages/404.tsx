import { CONFIG } from "../../site.config"
import { NextPageWithLayout, TPosts, TTags } from "../types"
import CustomError from "../routes/Error"
import MetaConfig from "src/components/MetaConfig"
import { joinUrl } from "src/libs/utils"

type Props = {
  tags: TTags
  posts: TPosts
}

const NotFoundPage: NextPageWithLayout<Props> = () => {
  return <CustomError />
}

NotFoundPage.getLayout = (page) => {
  return (
    <>
      <MetaConfig
        {...{
          title: `404 | ${CONFIG.blog.title}`,
          description: CONFIG.blog.description,
          type: "website",
          url: joinUrl(CONFIG.link),
          robots: "noindex, follow",
        }}
      />
      {page}
    </>
  )
}

export default NotFoundPage
