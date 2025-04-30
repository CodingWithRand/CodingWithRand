"use client"

import "./page.css";
import UpdateProfilePicture from "./components/account-settings/update-ppf";
import UpdateUsername from "./components/account-settings/update-username";
import UpdatePassword from "./components/account-settings/update-password";
import Client from "@/glient/util";
import { SignOutBTN, Username } from "./components/utility-components";
import Loading from "@/glient/loading";
import AuthenticationManagementPanel from "./components/account-settings/authentication-management-panel";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function SettingPage() {

  const { Image } = Client.Components.Dynamic;
  const isOpen = useRef(false);
  const menu = useRef(null);

  useEffect(() => {
    menu.current = document.querySelector("#navbar #menu-dropdown");
  }, [])
  
  function menuBtn(e) {
    if(!isOpen.current) {
        isOpen.current = true;
        menu.current.style.display = "flex";
        setTimeout(() => menu.current.style.opacity = 1, 500);
    } else {
        isOpen.current = false;
        menu.current.style.opacity = 0;
        setTimeout(() => menu.current.style.display = "none", 500)
    };
  }
  
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
              <button onClick={menuBtn}>
                <Client.Components.UserPFP />
              </button>
              <Client.Components.PreventCrossSiteComponent>
                <li className="flex justify-center"><SignOutBTN /></li>
              </Client.Components.PreventCrossSiteComponent>
          </ul>
          <ul id="menu-dropdown" style={{display: "none", right: "4rem"}}>
            <li><Link href="/settings/#upfp">Profile Picture</Link></li>
            <li><Link href="/settings/#uu">Username</Link></li>
            <li><Link href="/settings/#up">Password</Link></li>
            <li><Link href="/settings/#amp">Auth Panel</Link></li>
            <li><Link href="/">
              Back to Home
              <Image width="20" height="20" name="exit.png" dir="icon/"/>
            </Link></li>
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

