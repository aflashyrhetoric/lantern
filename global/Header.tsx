import React, { useState } from "react"
import Cookies from "js-cookie"
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from "carbon-components-react"
import { Logout20 } from "@carbon/icons-react"

interface Props {
  logout?: Function
  loggedIn?: boolean
}

const LHeader = ({ logout = null, loggedIn }: Props) => {
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
            <HeaderName href="/" prefix="LANTERN"> </HeaderName>
            <HeaderNavigation aria-label="Lantern">
              <HeaderMenuItem href="/scan-products">
                scan products
              </HeaderMenuItem>
              <HeaderMenuItem href="/appledore">
                appledore vaults
              </HeaderMenuItem>
              <HeaderMenuItem href="/utilities">widgets</HeaderMenuItem>
              {/* <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
              <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
                <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
              </HeaderMenu> */}
            </HeaderNavigation>
            <HeaderGlobalBar>
              {logout !== null && loggedIn && (
                <HeaderGlobalAction
                  aria-label="Search"
                  onClick={() => {
                    if (Cookies.get("logged_in") !== undefined) {
                      Cookies.remove("logged_in")
                    }

                    logout()
                    window.location.reload()
                  }}
                >
                  <Logout20 />
                </HeaderGlobalAction>
              )}
              {/* <HeaderGlobalAction
                aria-label="Notifications"
                isActive
                onClick={action("notification click")}
              >
                <Notification20 />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="App Switcher"
                onClick={action("app-switcher click")}
              >
                <AppSwitcher20 />
              </HeaderGlobalAction> */}
            </HeaderGlobalBar>
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              <SideNavItems>
                <HeaderSideNavItems>
                  <HeaderMenuItem href="/scan-products">
                    scan products
                  </HeaderMenuItem>
                  <HeaderMenuItem href="/appledore">
                    appledore vaults
                  </HeaderMenuItem>
                  <HeaderMenuItem href="/utilities">widgets</HeaderMenuItem>
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
