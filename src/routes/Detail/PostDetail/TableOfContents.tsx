import styled from "@emotion/styled"
import React, { useState } from "react"
import { TTableOfContents } from "src/types"

type Props = {
  entries: TTableOfContents
}

const TableOfContents: React.FC<Props> = ({ entries }) => {
  const [open, setOpen] = useState(false)

  return (
    <StyledWrapper>
      <button
        type="button"
        className="toggle"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="toggle-copy">
          <span className="arrow" aria-hidden="true">
            {open ? "▾" : "▸"}
          </span>
          <span className="title">
            {open ? "이 글의 목차 접기" : "이 글의 목차 보기"}
          </span>
        </span>
      </button>
      {open && (
        <nav>
          {entries.map((entry) => {
            const text = Array.isArray(entry.text)
              ? entry.text.join(" ")
              : entry.text

            return (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                style={{ paddingLeft: `${entry.indentLevel * 0.85}rem` }}
              >
                {text}
              </a>
            )
          })}
        </nav>
      )}
    </StyledWrapper>
  )
}

export default TableOfContents

const StyledWrapper = styled.div`
  display: grid;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.gray4};

  .toggle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    color: ${({ theme }) => theme.colors.gray10};
    cursor: pointer;
  }

  .toggle-copy {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  .arrow {
    font-size: 0.95rem;
    line-height: 1;
  }

  .title {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  nav {
    display: grid;
    gap: 0.6rem;
  }

  a {
    font-size: 0.92rem;
    line-height: 1.45rem;
    color: ${({ theme }) => theme.colors.gray10};

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
  }
`
