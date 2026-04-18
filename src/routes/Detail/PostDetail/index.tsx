import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import {
  PostDetail as PostDetailType,
  TAdjacentPosts,
  TInitialRecordMap,
  TPost,
  TTableOfContents,
} from "src/types"
import TableOfContents from "./TableOfContents"
import ReadingProgressBar from "./ReadingProgressBar"
import useTrackPageView from "src/hooks/useTrackPageView"

type Props = {
  data: PostDetailType
  pageLinkMap: Record<string, string>
  tableOfContents: TTableOfContents
  readTime: string | null
  adjacentPosts: TAdjacentPosts
  relatedPosts: TPost[]
  initialRecordMap: TInitialRecordMap
}

const PostDetail: React.FC<Props> = ({
  data,
  pageLinkMap,
  tableOfContents,
  readTime,
  adjacentPosts,
  relatedPosts,
  initialRecordMap,
}) => {
  const category = (data.category && data.category?.[0]) || undefined
  const shouldTrackPost = data.type[0] === "Post"

  useTrackPageView({
    pathKey: shouldTrackPost ? `post:${data.slug}` : `detail:${data.slug}`,
    slug: shouldTrackPost ? data.slug : undefined,
  })

  return (
    <StyledWrapper>
      <ReadingProgressBar />
      <article>
        {category && (
          <div css={{ marginBottom: "0.5rem" }}>
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </div>
        )}
        {data.type[0] === "Post" && (
          <PostHeader data={data} slug={data.slug} readTime={readTime} />
        )}
        {tableOfContents.length > 0 && data.type[0] === "Post" && (
          <div className="toc">
            <TableOfContents entries={tableOfContents} />
          </div>
        )}
        <div>
          <NotionRenderer
            pageId={data.id}
            pageLinkMap={pageLinkMap}
            initialRecordMap={initialRecordMap}
          />
        </div>
        {data.type[0] === "Post" && (
          <>
            <Footer adjacentPosts={adjacentPosts} relatedPosts={relatedPosts} />
            <CommentBox />
          </>
        )}
      </article>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;

  > article {
    margin: 0 auto;
    max-width: 42rem;
  }

  .toc {
    margin-bottom: 1.5rem;
  }
`
