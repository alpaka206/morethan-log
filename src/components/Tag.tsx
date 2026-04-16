import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"

type Props = {
  children: string
  readOnly?: boolean
}

const Tag: React.FC<Props> = ({ children, readOnly = false }) => {
  const router = useRouter()

  const handleClick = (value: string) => {
    router.push(`/?tag=${value}`)
  }
  if (readOnly) {
    return <StyledReadOnly>{children}</StyledReadOnly>
  }

  return (
    <StyledButton
      type="button"
      onClick={() => handleClick(children)}
      aria-label={`Filter posts by tag ${children}`}
    >
      {children}
    </StyledButton>
  )
}

export default Tag

const StyledButton = styled.button`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray10};
  background-color: ${({ theme }) => theme.colors.gray5};
  cursor: pointer;
`

const StyledReadOnly = styled.span`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray10};
  background-color: ${({ theme }) => theme.colors.gray5};
  display: inline-flex;
`
