import { dehydrate } from "@tanstack/react-query"
import styled from "@emotion/styled"
import Link from "next/link"
import { GetStaticProps } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis"
import DirectoryPageShell from "src/components/DirectoryPageShell"
import MetaConfig from "src/components/MetaConfig"
import { DEFAULT_CATEGORY } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
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

const CategoriesPage: NextPageWithLayout = () => {
  const categories = useCategoriesQuery()
  const entries = Object.entries(categories)
    .filter(([category]) => category !== DEFAULT_CATEGORY)
    .sort((a, b) => b[1] - a[1])

  return (
    <>
      <MetaConfig
        title={`Categories | ${CONFIG.blog.title}`}
        description="Browse posts by category."
        type="website"
        url={joinUrl(CONFIG.link, "categories")}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Categories | ${CONFIG.blog.title}`,
          description: "Browse posts by category.",
          url: joinUrl(CONFIG.link, "categories"),
        }}
      />
      <DirectoryPageShell
        title="Categories"
        description="A higher-level map of the blog so related writing stays grouped together."
      >
        <CategoryGrid>
          {entries.map(([category, count]) => (
            <li key={category} id={encodeURIComponent(category)}>
              <Link
                href={{
                  pathname: "/",
                  query: { category },
                }}
              >
                <strong>{category}</strong>
                <span>{count} posts</span>
              </Link>
            </li>
          ))}
        </CategoryGrid>
      </DirectoryPageShell>
    </>
  )
}

export default CategoriesPage

const CategoryGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
