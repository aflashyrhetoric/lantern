import React, { useState, useContext } from "react"
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

import { UserContext } from "../pages/_app"

interface Props {
  loggedIn?: boolean
}

const LHeader = () => {
  const { loggedIn, logout } = useContext(UserContext)
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
              GO
            </HeaderName>
            <HeaderNavigation aria-label="Lantern">
              <HeaderMenuItem href="/scan-products">echo</HeaderMenuItem>
              <HeaderMenuItem href="/appledore">appledore</HeaderMenuItem>
              <HeaderMenuItem href="/utilities">misc</HeaderMenuItem>
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
                  <HeaderMenuItem href="/scan-products">echo</HeaderMenuItem>
                  <HeaderMenuItem href="/appledore">appledore</HeaderMenuItem>
                  <HeaderMenuItem href="/utilities">misc</HeaderMenuItem>
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
