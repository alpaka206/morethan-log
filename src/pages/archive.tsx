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
import usePostsQuery from "src/hooks/usePostsQuery"
import { createQueryClient } from "src/libs/react-query"
import { filterPosts } from "src/libs/utils/notion"
import { formatDate, groupPostsByYear, joinUrl } from "src/libs/utils"
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

const ArchivePage: NextPageWithLayout = () => {
  const posts = usePostsQuery()
  const archive = groupPostsByYear(posts.filter((post) => post.type[0] === "Post"))
  const years = Array.from(archive.entries())

  useTrackPageView({ pathKey: "archive" })

  return (
    <>
      <MetaConfig
        title={`Archive | ${CONFIG.blog.title}`}
        description="Browse every published post grouped by year."
        type="website"
        url={joinUrl(CONFIG.link, "archive")}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Archive | ${CONFIG.blog.title}`,
          description: "Browse every published post grouped by year.",
          url: joinUrl(CONFIG.link, "archive"),
        }}
      />
      <DirectoryPageShell
        title="Archive"
        description="Published posts grouped by year so older writing stays easy to find."
      >
        <ArchiveList>
          {years.map(([year, yearPosts]) => (
            <section key={year}>
              <h2>{year}</h2>
              <ul>
                {yearPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/${post.slug}`}>
                      <span>
                        {formatDate(
                          post.date?.start_date || post.createdTime,
                          CONFIG.lang
                        )}
                      </span>
                      <strong>{post.title}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </ArchiveList>
      </DirectoryPageShell>
    </>
  )
}

export default ArchivePage

const ArchiveList = styled.div`
  display: grid;
  gap: 2rem;

  section {
    display: grid;
    gap: 1rem;
  }

  h2 {
    margin: 0;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  ul {
    display: grid;
    gap: 0.75rem;
  }

  li a {
    display: grid;
    gap: 0.3rem;
    padding: 1rem 1.1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "white" : theme.colors.gray4};
  }

  span {
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.gray10};
  }

  strong {
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${({ theme }) => theme.colors.gray12};
  }
`
