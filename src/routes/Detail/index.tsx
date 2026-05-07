import PostDetail from "./PostDetail"
import PageDetail from "./PageDetail"
import styled from "@emotion/styled"
import {
  PostDetail as PostDetailType,
  TAdjacentPosts,
  TInitialRecordMap,
  TPost,
  TTableOfContents,
} from "src/types"

type Props = {
  data: PostDetailType
  pageLinkMap: Record<string, string>
  tableOfContents: TTableOfContents
  adjacentPosts: TAdjacentPosts
  relatedPosts: TPost[]
  initialRecordMap: TInitialRecordMap
}

const Detail: React.FC<Props> = ({
  data,
  pageLinkMap,
  tableOfContents,
  adjacentPosts,
  relatedPosts,
  initialRecordMap,
}) => {
  return (
    <StyledWrapper data-type={data.type}>
      {data.type[0] === "Page" && (
        <PageDetail
          data={data}
          pageLinkMap={pageLinkMap}
          initialRecordMap={initialRecordMap}
        />
      )}
      {data.type[0] !== "Page" && (
        <PostDetail
          data={data}
          pageLinkMap={pageLinkMap}
          tableOfContents={tableOfContents}
          adjacentPosts={adjacentPosts}
          relatedPosts={relatedPosts}
          initialRecordMap={initialRecordMap}
        />
      )}
    </StyledWrapper>
  )
}

export default Detail

const StyledWrapper = styled.div`
  padding: 2rem 0;

  &[data-type="Paper"] {
    padding: 40px 0;
  }
  /** Reference: https://github.com/chriskempson/tomorrow-theme **/
  code[class*="language-mermaid"],
  pre[class*="language-mermaid"] {
    background-color: ${({ theme }) => theme.colors.gray5};
  }
`
