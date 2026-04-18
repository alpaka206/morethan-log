import { dehydrate } from "@tanstack/react-query"
import styled from "@emotion/styled"
import Link from "next/link"
import { GetStaticProps } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis"
import DirectoryPageShell from "src/components/DirectoryPageShell"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import useTrackPageView from "src/hooks/useTrackPageView"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { createQueryClient } from "src/libs/react-query"
import { filterPosts } from "src/libs/utils/notion"
import { joinUrl } from "src/libs/utils"
import {
  NextPageWithLayout,
  PagePropsWithDehydratedState,
} from "src/types"

export const getStaticProps: GetStaticProps<PagePropsWithDehydratedState> =
  async () => {
    const queryClient = createQueryClient()
    const posts = filterPosts(await getPosts())

    await queryClient.prefetchQuery(queryKey.posts(), () => posts)

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: CONFIG.revalidateTime,
    }
  }

const TagsPage: NextPageWithLayout = () => {
  const tags = useTagsQuery()
  const tagEntries = Object.entries(tags).sort((a, b) => b[1] - a[1])

  useTrackPageView({ pathKey: "tags" })

  return (
    <>
      <MetaConfig
        title={`Tags | ${CONFIG.blog.title}`}
        description="Browse posts by tag."
        type="website"
        url={joinUrl(CONFIG.link, "tags")}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Tags | ${CONFIG.blog.title}`,
          description: "Browse posts by tag.",
          url: joinUrl(CONFIG.link, "tags"),
        }}
      />
      <DirectoryPageShell
        title="Tags"
        description="A fast way to jump into recurring topics and follow a thread across posts."
      >
        <TokenGrid>
          {tagEntries.map(([tag, count]) => (
            <li key={tag} id={encodeURIComponent(tag)}>
              <Link
                href={{
                  pathname: "/",
                  query: { tag },
                }}
              >
                <strong>{tag}</strong>
                <span>{count} posts</span>
              </Link>
            </li>
          ))}
        </TokenGrid>
      </DirectoryPageShell>
    </>
  )
}

export default TagsPage

const TokenGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.85rem;

  li a {
    display: grid;
    gap: 0.35rem;
    padding: 1rem 1.1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "white" : theme.colors.gray4};
  }

  strong {
    font-size: 1rem;
    line-height: 1.4rem;
    color: ${({ theme }) => theme.colors.gray12};
  }

  span {
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
