"use client"

import "./page.css";
import UpdateProfilePicture from "./components/account-settings/update-ppf";
import UpdateUsername from "./components/account-settings/update-username";
import UpdatePassword from "./components/account-settings/update-password";
import Client from "@/glient/util";
import { SignOutBTN, Username } from "./components/utility-components";
import Loading from "@/glient/loading";
import AuthenticationManagementPanel from "./components/account-settings/authentication-management-panel";

export default function SettingPage() {
  return (
      <Loading cover>
        <nav id="navbar">
          <ul>
              <li className="text-md sm:text-lg">Welcome!</li>
              <Username />
          </ul>
          <ul>
              <Client.Components.PreventCrossSiteComponent>
                <Client.Components.ThemeChanger />
              </Client.Components.PreventCrossSiteComponent>
              <li><Client.Components.UserPFP /></li>
              <Client.Components.PreventCrossSiteComponent>
                <li className="flex justify-center"><SignOutBTN /></li>
              </Client.Components.PreventCrossSiteComponent>
          </ul>
        </nav>
        <main className="flex items-center flex-col">
          <UpdateProfilePicture />
          <UpdateUsername />
          <UpdatePassword />
          <AuthenticationManagementPanel />
        </main>
      </Loading>
  )
}

