import React from "react"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import { PostDetail as PostDetailType } from "src/types"

type Props = {
  data: PostDetailType
  pageLinkMap: Record<string, string>
}

const PageDetail: React.FC<Props> = ({ data, pageLinkMap }) => {
  return (
    <StyledWrapper>
      <NotionRenderer pageId={data.id} pageLinkMap={pageLinkMap} />
    </StyledWrapper>
  )
}

export default PageDetail

const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: 56rem;
`
