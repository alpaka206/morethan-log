import styled from "@emotion/styled"
import React, { ReactNode } from "react"

type Props = {
  title: string
  description: string
  children: ReactNode
}

const DirectoryPageShell: React.FC<Props> = ({
  title,
  description,
  children,
}) => {
  return (
    <StyledWrapper>
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <section>{children}</section>
    </StyledWrapper>
  )
}

export default DirectoryPageShell

const StyledWrapper = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (min-width: 768px) {
    padding: 3rem 1.5rem 5rem;
  }

  header {
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  p {
    margin: 0.75rem 0 0;
    color: ${({ theme }) => theme.colors.gray10};
    line-height: 1.75rem;
  }
`
