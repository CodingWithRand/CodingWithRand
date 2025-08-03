"use client"

import "./client.css"
import { useState, useRef } from "react";
import Client from "@/glient/util";
import Neutral from "@/geutral/util";
import { auth, serverRPC, supabase } from "@/glient/supabase";
import { useLoadingState } from "@/glient/loading";

export default function SignIn() {

    const { Switch, Dynamic } = Client.Components;
    const { AlertBox, InputField } = Dynamic;

    const setLoadingState = useLoadingState();

    const userEmail = useRef("");
    const userPass = useRef("");
    const userName = useRef("");

    const [inputType, setInputType] = useState("password");
    const [result, debug] = useState(false);
    const [result2, debug2] = useState(false);
    const [dialogMessages, setDM] = useState({
        title: "",
        subtitle: "",
        description: ""
    })
    const [errMsg, setErrMsg] = useState("");

    async function initiateSignInProgress(e) {
        e.preventDefault();
        userEmail.current = e.target.elements["email"].value;
        userName.current = e.target.elements["user"].value;
        userPass.current = e.target.elements["pass"].value;
        setLoadingState(true);
        try {
            if ((await supabase.schema("public").from("users-details").select("display_name").eq("display_name", userName.current)).data.length !== 0 ) {
                const { data, error } = await auth.signInWithPassword({ email: userEmail.current, password: userPass.current });
                if(error) throw error;

                const userSession = await supabase.auth.getSession();

                await serverRPC("sign_in", {
                    p_uid: data.user.id,
                    p_ip: await Neutral.Functions.getClientIp(),
                    platform: "codingwithrand"
                }, userSession.data.session.access_token);

                await Neutral.Functions.asyncDelay(1000);
                // window.location.replace("/");
            } else {
                debug(true);
                setErrMsg("Invalid username");
            }
        } catch (error) {
            if(error.message === "Invalid login credentials"){
                setErrMsg("Password or email is incorrect");
            }else{
                setErrMsg("Something went wrong, please try again later");
            }
            debug(true); console.error(error);
        }
        setLoadingState(false);
    };

    function onFormUpdate(e, refValue) {
        e.preventDefault();
        refValue.current = e.target.value;
    };

    return (
        <>
            <h2 className="reg-t">Sign In</h2>
            <form className="reg-form" onClick={(e) => e.stopPropagation()} onSubmit={initiateSignInProgress}>
                <div className="f-c">
                    <label className="field-label">Username</label>
                    <InputField
                        id="user"
                        name="user" type="text" required
                        onChange={{
                            binded: true,
                            expected_condition: [0],
                            run_test: (e) => 0,
                            actions: [(e) => onFormUpdate(e, userName)]
                        }}
                    />
                    <label className="field-label">Email</label>
                    <InputField
                        id="email"
                        name="email" type="email" required
                        onChange={{
                            binded: true,
                            expected_condition: [0],
                            run_test: (e) => 0,
                            actions: [(e) => onFormUpdate(e, userEmail)]
                        }}
                    />
                    <label className="field-label">Password</label>
                    <InputField
                        id="pass"
                        name="pass" type={inputType} required
                        onChange={{
                            binded: true,
                            expected_condition: [0],
                            run_test: (e) => 0,
                            actions: [(e) => onFormUpdate(e, userPass)]
                        }}
                    />
                    <div className="option-field">
                        <div className="show-pass">
                            <Switch mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")} />
                            <span className="field-label">Show Password</span>
                        </div>
                        <span className="forget-password" onClick={() => auth.resetPasswordForEmail(prompt("Your email:")).then(() => {
                            debug2(true);
                            setDM((prevDM) => ({ ...prevDM, title: "Password reset email has been sent!", subtitle: "Please check your email inbox!", description: "" }))
                        }).catch(() => alert("Invalid Email"))}>Forgot your password? Reset it here</span>
                    </div>
                    <button className="submit-btn" type="submit">Sign In</button>
                </div>
            </form>
            <AlertBox id="sign-in-alert-box" detect={result} messages={{
                title: "Sign in failed",
                subtitle: errMsg,
                action: "OK"
            }}
                action={() => { debug(false); Neutral.Functions.jobDelay(() => setErrMsg(""), 500); }} />
            <AlertBox id="password-change-alert-box" detect={result2} messages={{
                title: dialogMessages.title,
                subtitle: dialogMessages.subtitle,
                description: dialogMessages.description,
                action: "OK"
            }}
                action={() => { debug2(false); }} />
        </>
    )
}