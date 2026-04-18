import React from "react"
import styled from "@emotion/styled"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../components/NotionRenderer"
import { PostDetail as PostDetailType } from "src/types"

type Props = {
  data: PostDetailType
  pageLinkMap: Record<string, string>
  initialRecordMap?: ExtendedRecordMap | null
}

const PageDetail: React.FC<Props> = ({
  data,
  pageLinkMap,
  initialRecordMap,
}) => {
  return (
    <StyledWrapper>
      <NotionRenderer
        pageId={data.id}
        pageLinkMap={pageLinkMap}
        initialRecordMap={initialRecordMap}
      />
    </StyledWrapper>
  )
}

export default PageDetail

const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: 56rem;
`
