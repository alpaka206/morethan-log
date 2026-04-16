import styled from "@emotion/styled"
import { CONFIG } from "site.config"

const NavBar: React.FC = () => {
  const links = [
    {
      id: 1,
      name: "Portfolio",
      to: CONFIG.profile.portfolio,
      external: true,
    },
  ]

  return (
    <StyledWrapper>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.to}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;
  ul {
    display: flex;
    flex-direction: row;
    li {
      display: block;
      margin-left: 1rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }
`
