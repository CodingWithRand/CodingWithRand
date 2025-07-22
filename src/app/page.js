"use client"

import "./page.css";
import "@/gss/font.css";
import { Intro, SkillsBlock } from "./components/client/constructor-components";
import { Article } from "./components/client/utility-components";
import Client from "./global/client/util";
import { useEffect, useState } from "react";
import { useGlobal } from "@/glient/global";
import { auth, serverUpdate } from "@/glient/supabase";

const { Section, InputGroupField } = Client.Components.Dynamic;
const { Switch } = Client.Components;

export default function Home() {
  const { authEvent, authUser } = useGlobal();

  useEffect(() => {
    if(authEvent.authEvent === "PASSWORD_RECOVERY") document.getElementById("authentication-action-alert-box").showModal();
  }, [authEvent])

  useEffect(() => {
    // email_verified update when email is verified (waiting for confirmation)
    (async () => {
      if(authUser.isAuthUser.email_confirmed_at){
        await serverUpdate("public", "users-details", { email_verified: true }, { columnName: "uid", value: authUser.isAuthUser.id });
      }
    })()
  }, [authUser.isAuthUser])

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
      {/* This is temporary, you have to find a better measure for this in the future! */}
      <dialog id="authentication-action-alert-box" className={`alert-box responsive theme ctn bg-color border-color`}>
            <div className="dialog-nester responsive">
            <ResetPasswordForm />
            </div>
      </dialog>
    </>
  );
}


function ResetPasswordForm(){

  const [passConfirmed, checkPass] = useState(true);
  const [userPass, setUserPass] = useState("");
  const [inputType, setInputType] = useState("password");

  async function changePassword(e){
      e.preventDefault();
      if(passConfirmed) return;
      try{
          const { data, error } = await auth.updateUser({ password: userPass });
          if (error) throw error;
          alert("Successfully Changing your password: You're good to go now")
          document.getElementById("authentication-action-alert-box").close()
      } catch (error) {
          alert("Changing Password failed: Something went wrong, please try again later!");
          console.error(error)
      }
  }

  return(
      <Section themed style="pallete" title="Password" description="Change your password here">
          <form className="password setting-submitting-form" onSubmit={changePassword}>
              <InputGroupField 
                  fieldNumber={2} themed
                  name={["password", "pass-confirm"]} required={[true, true]} errDetector={[true, true]}
                  detectorCls={["pw", "pwc"]} type={[inputType, inputType]}
                  unstaticAttributes={["type"]}
                  placeholder={["Your desire password here", "Confirm the password again"]}
                  onChange={[
                      {
                          binded: true,
                          expected_condition: [0, 1],
                          run_test: (e) => {
                              if(e.target.value.length > 7) return 0;
                              else return 1;
                          },
                          actions: [
                              (e) => { setUserPass(e.target.value); },
                              (e) => { setUserPass(""); }
                          ]
                      },
                      {
                          binded: true,
                          expected_condition: [0, 1],
                          run_test: (e) => {
                              if(e.target.value !== userPass) return 1;
                              else return 0;
                          },
                          actions: [
                              (e) => { checkPass(false) },
                              (e) => { checkPass(true) }
                          ]
                      }
                  ]}
                  warningMsg={[["", "Password must contain at least 8 characters"], ["", "Password does not match!"]]}
              />

              <div className="option-field">
                  <Switch cls="specific" mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")}/>
                  <label className="field-label">Show Password</label>
              </div>
              <button className="submit-btn" type="submit" disabled={passConfirmed}>Submit</button>
          </form>
      </Section>
  )
}
