import useMermaidEffect from "./hooks/useMermaidEffect"
import PostDetail from "./PostDetail"
import PageDetail from "./PageDetail"
import styled from "@emotion/styled"
import { PostDetail as PostDetailType } from "src/types"

type Props = {
  data: PostDetailType
  pageLinkMap: Record<string, string>
}

const Detail: React.FC<Props> = ({ data, pageLinkMap }) => {
  return (
    <StyledWrapper data-type={data.type}>
      {data.type[0] === "Page" && (
        <PageDetail data={data} pageLinkMap={pageLinkMap} />
      )}
      {data.type[0] !== "Page" && (
        <PostDetail data={data} pageLinkMap={pageLinkMap} />
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
