import styled from "@emotion/styled"
import Link from "next/link"
import React from "react"
import { CONFIG } from "site.config"
import { formatDate } from "src/libs/utils"
import { TAdjacentPosts, TPost } from "src/types"

type Props = {
  adjacentPosts: TAdjacentPosts
  relatedPosts: TPost[]
}

const Footer: React.FC<Props> = ({ adjacentPosts, relatedPosts }) => {
  return (
    <StyledWrapper>
      <div className="actions">
        <Link href="/">Back to blog</Link>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Top
        </button>
      </div>
      {(adjacentPosts.prev || adjacentPosts.next) && (
        <div className="link-group">
          {adjacentPosts.next && (
            <PostLinkCard label="Newer post" post={adjacentPosts.next} />
          )}
          {adjacentPosts.prev && (
            <PostLinkCard label="Older post" post={adjacentPosts.prev} />
          )}
        </div>
      )}
      {relatedPosts.length > 0 && (
        <div className="link-group">
          {relatedPosts.map((post) => (
            <PostLinkCard key={post.id} label="Related" post={post} compact />
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default Footer

type PostLinkCardProps = {
  label: string
  post: TPost
  compact?: boolean
  align?: "left" | "right"
}

const PostLinkCard: React.FC<PostLinkCardProps> = ({
  label,
  post,
  compact = false,
}) => (
  <StyledCard href={`/${post.slug}`} data-compact={compact}>
    <span className="label">{label}</span>
    <strong>{post.title}</strong>
    <span className="meta">
      {formatDate(post.date?.start_date || post.createdTime, CONFIG.lang)}
    </span>
  </StyledCard>
)

const StyledWrapper = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 2rem;

  .actions {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .actions a,
  .actions button {
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .link-group {
    display: grid;
    gap: 0.65rem;
  }
`

const StyledCard = styled(Link)`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.45rem;
  color: ${({ theme }) => theme.colors.gray10};

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  strong {
    color: ${({ theme }) => theme.colors.gray12};
  }

  .meta {
    font-size: 0.8rem;
  }

  :hover {
    color: ${({ theme }) => theme.colors.gray12};
  }
`
