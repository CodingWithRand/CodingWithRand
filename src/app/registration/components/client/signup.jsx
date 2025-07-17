"use client"

import "./client.css"
import { useState, useEffect } from "react";
import { auth, serverFetch, serverInsert } from "@/glient/supabase";
import { useLoadingState } from "@/glient/loading";
import Client from "@/glient/util";
import Neutral from"@/geutral/util";
import EmailVerifificationPage from "./email-verification";
import Cookies from "universal-cookie";

export default function SignUp() {
    const cookies = new Cookies();

    const { Switch, Dynamic } = Client.Components;
    const { AlertBox, InputField, InputGroupField } = Dynamic;

    const [userEmail, setUserEmail] = useState("");
    const [userPass, setUserPass] = useState("");
    const [userName, setUserName] = useState("");
    const [passConfirmed, checkPass] = useState(false);

    const [inputType, setInputType] = useState("password");
    const [regFormUnDone, validate] = useState(true);

    const [signUpSuccess, setSUS] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    
    const setLoadingState = useLoadingState();

    useEffect(() => {
        if (userEmail !== "" && userPass !== "" && userName !== "" && passConfirmed) validate(false);
        else validate(true);
    }, [userEmail, userPass, userName, passConfirmed]);

    async function initiateCreatingAccountProgress(e) {
        setUserEmail(e.target.elements["e-mail"].value);
        setUserName(e.target.elements["username"].value);
        setUserPass(e.target.elements["password"].value);

        if (userEmail === "" || userPass === "" || userName === "" || !passConfirmed) return
        e.preventDefault();

        setLoadingState(true);

        try{
            // make this more secure -> create an encrypted api key for this and decrypt it before sending it to the server with a function.
            const isEmailExisted = await serverFetch("users-details", "email", { columnName: "email", value: userEmail });
            const isUsernameExisted = await serverFetch("users-details", "display_name", { columnName: "display_name", value: userName });
            console.log(isEmailExisted, isUsernameExisted)
            if (isEmailExisted.length !== 0 || isUsernameExisted.length !== 0) {
                setSUS(true); setErrMsg("This username or email has been taken");
                setLoadingState(false)
                return;
            }
            const { data, error } =  await auth.signUp({ email: userEmail, password: userPass }, { data: { display_name: userName } });
            if (error) throw error;
            setEmailSent(true);

            await serverInsert("users-details", {
                uid: data.user.id,
                email: userEmail,
                display_name: userName,
                email_verified: false,
            })

            await serverInsert("auth-states", {
                uid: data.user.id,
            })

            await serverInsert("codingwithrand", {
                ip: await Neutral.Functions.getClientIp(),
                authenticated: true,
            })

            
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch (errorCode) {
                default:
                    setSUS(true);
                    setErrMsg("Something went wrong, please try again later");
                    console.log(errorCode, errorMessage);
                    break;
            }
        }
        setLoadingState(false);
    }

    return (
        <>
            <h2 className="reg-t">Create an account</h2>
            <form className="reg-form" style={{ width: "80%" }} onClick={(e) => e.stopPropagation()} onSubmit={initiateCreatingAccountProgress}>
                <div className="f-c">
                    <label className="field-label">Username</label>
                    <InputField
                        id="username"
                        name="username" required errDetector
                        detectorCls="un" type="text"
                        placeholder="Your desire username here"
                        onChange={{
                            binded: true,
                            expected_condition: [0, 1],
                            run_test: (e) => {
                                const NamePattern = /^[^\_][\w\s]+[^\s\W\_]$/g;
                                if (NamePattern.test(e.target.value) && e.target.value.length > 2) return 0
                                else return 1
                            },
                            actions: [
                                (e) => { setUserName(e.target.value); },
                                (e) => { setUserName(""); }
                            ]
                        }}
                        warningMsg={["", "Name doesn't satisfy the format"]}
                        warningMsgDescription={"(At least 3 character, must be English, doesn't contain special character except \"_\", and doesn't start with \"_\")"}
                    />
                    <label className="field-label">Email</label>
                    <InputField
                        id="e-mail"
                        name="e-mail" required errDetector
                        detectorCls="em" type="email"
                        placeholder="Your email here"
                        onChange={{
                            binded: true,
                            expected_condition: [0, 1, 2],
                            run_test: async (e) => {
                                const EmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
                                if (EmailPattern.test(e.target.value)) return 0
                                else return 1
                            },
                            actions: [
                                (e) => { setUserEmail(e.target.value); },
                                (e) => { setUserEmail(""); }
                            ]
                        }}
                        warningMsg={["", "Email is invalid!"]}
                    />
                    <label className="field-label">Password</label>
                    <InputGroupField
                        fieldNumber={2}
                        id={["password", "pass-confirm"]}
                        name={["password", "pass-confirm"]} required={[true, true]} errDetector={[true, true]}
                        detectorCls={["pw", "pwc"]} type={[inputType, inputType]}
                        unstaticAttributes={["type"]}
                        placeholder={["Your desire password here", "Confirm the password again"]}
                        onChange={[
                            {
                                binded: true,
                                expected_condition: [0, 1],
                                run_test: (e) => {
                                    if (e.target.value.length > 7) return 0;
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
                                    if (e.target.value !== userPass) return 1;
                                    else return 0;
                                },
                                actions: [
                                    (e) => { checkPass(true) },
                                    (e) => { checkPass(false) }
                                ]
                            }
                        ]}
                        warningMsg={[["", "Password must contain at least 8 characters"], ["", "Password does not match!"]]}
                    />
                    <div className="option-field">
                        <div className="show-pass">
                            <Switch mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")} />
                            <label className="field-label">Show Password</label>
                        </div>
                    </div>
                    <button className="submit-btn" type="submit" disabled={regFormUnDone}>Create a new account</button>
                </div>
            </form>
            <AlertBox id="sign-up-alert-box" detect={signUpSuccess} messages={{
                title: "Sign up failed",
                subtitle: errMsg,
                action: "OK"
            }}
                action={() => { setSUS(false); Neutral.Functions.jobDelay(() => setErrMsg(""), 500); }} />
            <AlertBox id="email-verification-intermission" detect={emailSent}>
                <EmailVerifificationPage email={userEmail}/>
            </AlertBox>
        </>
    )
}