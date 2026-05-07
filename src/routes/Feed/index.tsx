import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import SearchInput from "./SearchInput"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import TagList from "./TagList"
import MobileProfileCard from "./MobileProfileCard"
import ProfileCard from "./ProfileCard"
import ServiceCard from "./ServiceCard"
import ContactCard from "./ContactCard"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"
import { HEADER_HEIGHT } from "src/constants/layout"
import { normalizeQueryValue } from "src/libs/utils"

type Props = {}

const Feed: React.FC<Props> = () => {
  const router = useRouter()
  const queryQ = normalizeQueryValue(router.query.q)
  const [q, setQ] = useState(queryQ)

  useEffect(() => {
    setQ(queryQ)
  }, [queryQ])

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const nextQ = q.trim()

    if (nextQ === queryQ) {
      return
    }

    const timer = window.setTimeout(() => {
      const query = { ...router.query }

      if (nextQ) {
        query.q = nextQ
      } else {
        delete query.q
      }

      void router.replace(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true, scroll: false }
      )
    }, 180)

    return () => {
      window.clearTimeout(timer)
    }
  }, [q, queryQ, router])

  return (
    <StyledWrapper>
      <div className="lt">
        <ProfileCard />
        <ServiceCard />
        <ContactCard />
        <div className="footer">
          <Footer />
        </div>
      </div>
      <div className="mid">
        <MobileProfileCard />
        <PinnedPosts q={q} />
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tags">
          <TagList />
        </div>
        <FeedHeader />
        <PostList q={q} />
        <div className="footer">
          <Footer />
        </div>
      </div>
      <div className="rt">
        <TagList />
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  display: block;
  padding: 0.5rem 0;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 1.5rem;
    padding: 2rem 0;
    height: calc(100dvh - ${HEADER_HEIGHT}px);
    overflow: hidden;
  }

  > .lt,
  > .mid,
  > .rt {
    @media (min-width: 1024px) {
      min-height: 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  > .lt {
    display: none;

    @media (min-width: 1024px) {
      display: block;
      grid-column: span 3 / span 3;
    }

    .footer {
      padding-top: 1rem;
    }
  }

  > .mid {
    @media (min-width: 1024px) {
      grid-column: span 7 / span 7;
    }

    > .tags {
      display: block;

      @media (min-width: 1024px) {
        display: none;
      }
    }

    > .footer {
      padding: 0.5rem 0;
      @media (min-width: 1024px) {
        display: none;
      }
    }
  }

  > .rt {
    display: none;

    @media (min-width: 1024px) {
      display: block;
      grid-column: span 2 / span 2;
    }
  }
`
