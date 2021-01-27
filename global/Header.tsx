import React, { useState } from "react"
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenu,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from "carbon-components-react"

const LHeader: React.FC = () => {
  return (
    <>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label="IBM Platform Name">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="/" prefix="LNTRN">
              AI
            </HeaderName>
            <HeaderNavigation aria-label="Lantern">
              <HeaderMenuItem href="/utilities">
                utilities
              </HeaderMenuItem>
              <HeaderMenuItem href="/scan-products">echo</HeaderMenuItem>
              {/* <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
              <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
              </HeaderMenu> */}
            </HeaderNavigation>
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              <SideNavItems>
                <HeaderSideNavItems>
                  <HeaderMenuItem href="/utilities">utilities</HeaderMenuItem>
                  <HeaderMenuItem href="/scan-products">echo</HeaderMenuItem>
                  {/* <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
                  <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                    <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                    <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
                    <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
                  </HeaderMenu> */}
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
          </Header>
        )}
      />
      <div style={{ marginBottom: "50px" }}></div>
    </>
  )
}

export default LHeader
