"use client"

import "./page.css";
import "@/gss/font.css";
import { Intro, SkillsBlock } from "./components/client/constructor-components";
import { Article } from "./components/client/utility-components";
import Client from "./global/client/util";
import { supabase, auth, serverFetch } from "@/glient/supabase";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    (async () => {
      // // const { ierror } = supabase.schema("private").from("users-details").insert({ email: "a@b.com", ip: "1.0.1.1" })
      // const { ierror } = await supabase.from("test").insert({ test: "3r54oktggttttttttt" })
      // // const { data, error } = supabase.schema("private").from("users-details").select("*")
      // const { data, error } = await supabase.from("atest").select("id")
      // console.log(ierror, data, error)
      console.log(await auth.getUser())
      // console.log(await serverFetch("users-details", "email", { columnName: "email", value: "cwr@gmail.com" }))
    })()
  })
  return (
    <>
      <Intro />
      <main className="relative py-12">
          <section id="about-me" style={{width: "100vw", height: "auto"}}>
              <article className="content">
                <Article id="origin" index={1} />
                <Article id="interest" index={2} />
                <Article id="learning-style" index={3} />
              </article>
              <article className="skills">
                <SkillsBlock />
              </article>
              <i className="text-black dark:text-white text-center p-4 sm:text-2xl lg:text-4xl w-full block">&quot;Time is precious, so manage it wisely.&quot;</i>
          </section>
      </main>
      <Client.Components.CWRFooter />
    </>
  );
}

