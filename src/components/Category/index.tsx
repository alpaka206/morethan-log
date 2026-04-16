import { useRouter } from "next/router"
import React from "react"
import { COLOR_SET, CUSTOM_COLOR_SET } from "./constants"
import styled from "@emotion/styled"
import { colors } from "src/styles"

export const getColorClassByName = (name: string): string => {
  if (CUSTOM_COLOR_SET[name]) {
    return CUSTOM_COLOR_SET[name]
  }

  try {
    let sum = 0
    name.split("").forEach((alphabet) => (sum = sum + alphabet.charCodeAt(0)))
    const colorKey = sum
      .toString(16)
      ?.[sum.toString(16).length - 1].toUpperCase()
    return COLOR_SET[colorKey]
  } catch {
    return COLOR_SET[0]
  }
}

type Props = {
  children: string
  readOnly?: boolean
}

const Category: React.FC<Props> = ({ readOnly = false, children }) => {
  const router = useRouter()

  const handleClick = (value: string) => {
    if (readOnly) return
    router.push(`/?category=${value}`)
  }

  const commonStyle = {
    backgroundColor: getColorClassByName(children),
    cursor: readOnly ? "default" : "pointer",
  }

  if (readOnly) {
    return <StyledReadOnly css={commonStyle}>{children}</StyledReadOnly>
  }

  return (
    <StyledButton
      type="button"
      onClick={() => handleClick(children)}
      aria-label={`Filter posts by category ${children}`}
      css={commonStyle}
    >
      {children}
    </StyledButton>
  )
}

export default Category

const StyledButton = styled.button`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 9999px;
  width: fit-content;
  font-size: 0.875rem;
  line-height: 1.25rem;
  opacity: 0.9;
  color: ${colors.dark.gray1};
`

const StyledReadOnly = styled.span`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 9999px;
  width: fit-content;
  font-size: 0.875rem;
  line-height: 1.25rem;
  opacity: 0.9;
  color: ${colors.dark.gray1};
  display: inline-flex;
`
