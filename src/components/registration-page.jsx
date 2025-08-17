import "../css/use/registration-page.css"
import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "react-router-dom";
import { BgMusicController } from "./setup";
import All from "../scripts/util";
import { useGlobal } from "../scripts/global";
import { supabase, auth, serverRPC} from "../scripts/supabase";

function SignIn() {

    const { Switch, Dynamic } = All.Components;
    const { AlertBox, InputField } = Dynamic;

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
        try {
            if ((await supabase.schema("public").from("users-details").select("display_name").eq("display_name", userName.current)).data.length !== 0 ) {
                const { data, error } = await auth.signInWithPassword({ email: userEmail.current, password: userPass.current });
                if(error) throw error;

                await serverRPC("sign_in", {
                    p_uid: data.user.id,
                    p_ip: await All.Functions.getClientIp(),
                    platform: "cwr-education"
                }, data.session.access_token);

                await All.Functions.asyncDelay(1000);
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

function EmailVerifificationPage(props) {
    const { Dynamic } = All.Components;
    const { Image } = Dynamic;

    const [ timer, countdown ] = useState(60);
    const [ btnState, setBtnState ] = useState(true);
    const { authUser } = useGlobal();

    // Client.Hooks.useDelayedEffect(() => {
    //     if(login.isLoggedIn && auth.currentUser?.emailVerified) if(window === window.parent) window.location.replace("/");
    // }, [login.isLoggedIn, auth.currentUser?.emailVerified], 1000);

    All.Hooks.useDelayedEffect(() => {
        if(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at !== null){
            console.log('verified');
            window.location.replace("/")
        }
    }, [authUser.isAuthUser], 1000)
    
    useEffect(() => {
        (async () => {
            await All.Functions.asyncDelay(1000);
            if(timer < 1){
                setBtnState(false);
                return;
            };
            countdown((prevTime) => {return prevTime - 1});
        })();
    }, [timer])

    return(
        <div className="notf-box responsive">
            <div className="notf-title theme text-color">We have sent a verification email to you!</div>
            <Image constant dir="icon/" cls="email-icon responsive" alt="email" name="email.png"/>
            <div className="notf-msg theme text-color">Please check your inbox</div>
            <button className="notf-action" disabled={btnState} onClick={async () => {
                await auth.resend({
                    type: "signup",
                    email: props.email,
                })
                console.log('success again');
                setBtnState(true);
                countdown(60);
            }}>{`Click to send the verification email again in ${timer}s`}</button>
        </div>
    )
}

function SignUp() {

    const { Switch, Dynamic } = All.Components;
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

        try{
            // make this more secure -> create an encrypted api key for this and decrypt it before sending it to the server with a function.
            const isEmailExisted = await supabase.rpc("check_email_exists", { i_email: userEmail });
            const isUsernameExisted = await supabase.schema("public").from("users-details").select("display_name").eq("display_name", userName);

            if (isEmailExisted.data || isUsernameExisted.data.length !== 0) {
                setSUS(true); setErrMsg("This username or email has been taken");
                return;
            }
            const { data, error } =  await auth.signUp({ email: userEmail, password: userPass }, { data: { display_name: userName } });
            if (error) throw error;
            setEmailSent(true);

            await serverRPC("sign_up", {
                p_uid: data.user.id,
                username: userName,
                email: userEmail,
                ip: await Neutral.Functions.getClientIp(),
                platform: "cwr-education"
            }, data.session.access_token);

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

function SwitchPageBtn(){
    const [searchParams, setSearchParams] = useSearchParams();
    const regPage = searchParams.get("page")
    let regwrapper, regmode;

    function swipeToSignup(){
        regwrapper.style.transform = "translateX(-52%)";
        document.getElementById("login").style.opacity = 0;
        document.getElementById("signup").style.opacity = 1;
        regwrapper.setAttribute("focusing", "signup");
        regmode.textContent = "Already have an account? Login now!"
    };

    function swipeToLogin(){
        regwrapper.style.transform = "translateX(0%)";
        document.getElementById("login").style.opacity = 1;
        document.getElementById("signup").style.opacity = 0;
        regwrapper.setAttribute("focusing", "login");
        regmode.textContent = "Don't have account? Create one!"
    };

    useEffect(() => {
        regwrapper = document.querySelector(".reg-wrapper");
        regmode = document.getElementById("registration-mode");
        if(regPage === "login") swipeToLogin();
        else if(regPage === "register") swipeToSignup();
    }, []);

    return(
        <span id="registration-mode" className="responsive" onClick={() => {
            if(regwrapper.getAttribute("focusing") === "login") swipeToSignup();
            else if(regwrapper.getAttribute("focusing") === "signup") swipeToLogin();
        }}>Don&apos;t have account? Create one!</span>
    )
}

export default function RegistrationPage(){
    useEffect(() => {
        (async () => {
            await All.Functions.jobDelay(() => {
                try { document.querySelector('.h-reg').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 400)
            await All.Functions.jobDelay(() => {
                try { document.querySelector('#registration-iframe').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 1000)
        })();
    }, []);

    return(
        <div className="page-container spaceship-cockpit-panel" style={{ rowGap: "1rem" }}>
            <div className="setup">
                <BgMusicController />
            </div>
            <h1 className="h-reg responsive" style={{ color: "white" }}>Please let me know who you are</h1>
            {/* <iframe
                id="registration-iframe"
                className="crossite-iframe"
                src="https://codingwithrand.vercel.app/registration"
            /> */}
            <div id="registration-iframe" className="login-pallete crossite-iframe">
                <div className="reg-wrapper" focusing="login">
                    <div id="login" className="reg-box">
                        <SignIn />
                    </div>
                    <div id="signup" className="reg-box">
                        <SignUp />
                    </div>
                </div>
                <Suspense>
                    <SwitchPageBtn/>
                </Suspense>
            </div>
            <All.Components.HyperspaceTeleportationBackground />
        </div>
    );
};