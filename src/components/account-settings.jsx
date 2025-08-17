import { useEffect, useRef, useState } from "react"
import { useGlobal } from "../scripts/global"
import All from "../scripts/util";
import { BgMusicController } from "./setup";
import { serverRPC, supabase, auth, serverUpdate } from "../scripts/supabase";

const { Dynamic, Switch } = All.Components;
const { Image, Section, AlertBox, InputField, InputGroupField } = Dynamic;

function interpretSessionInfo(meta, identifier) {
    switch(meta) {
        case "name":
            return identifier === "codingwithrand" ? "Main Website" :
                   identifier === "cwr-education" ? "Education Website" :
                   identifier === "planreminder" ? "Remind Me" : "Unknown Session";
        case "url":
            return identifier === "codingwithrand" ? "https://codingwithrand.vercel.app" :
                   identifier === "cwr-education" ? "https://cwr-education.vercel.app" :
                   identifier === "planreminder" ? "Not Available" : "Unknown Session";
    }
}

function SessionsInfo(){
    const [ sessionComponents, setSessionComponents ] = useState([]);
    const { authUser } = useGlobal();

    All.Hooks.useDelayedEffect(() => {
        console.log(!!authUser.isAuthUser)
        if(!authUser.isAuthUser){
            window.location.replace("/registration");
            return
        }
        (async () => {
            let sc = [];
            const userSession = await supabase.auth.getSession();
            const userAuthData = await serverRPC("auth_states_request", { p_uid: authUser.isAuthUser.id }, userSession.data.session.access_token);

            for (const [session_name, session_data] of Object.entries(userAuthData)) {
                const locationResponse = await fetch(`https://ipwho.is/${session_data.ip}`);
                const location = await locationResponse.json();
                if(!session_data.authenticated) continue;
                sc.push(
                    <div className="session-info theme text-color" id={session_name} key={session_name}>
                        <h3>{interpretSessionInfo("name", session_name)}</h3>
                        <a href={interpretSessionInfo("url", session_name)}><b>URL: </b>{interpretSessionInfo("url", session_name)}</a>
                        <dl>
                            <dt><i><b>Issued at:</b></i></dt>
                            <dd>{(() => {
                                const date = new Date(session_data.authenticated_at);
                                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                return new Intl.DateTimeFormat('en-GB', {
                                    dateStyle: 'full',
                                    timeStyle: 'long',
                                    timeZone: timezone
                                }).format(date);
                            })()}</dd>
                            <dt><i><b>Login location:</b></i></dt>
                            <dd>{`${location.city}, ${location.region}, ${location.country}, ${location.continent}`}</dd>
                            <dt><i><b>Internet IP:</b></i></dt>
                            <dd>{session_data.ip}</dd>
                        </dl>
                        <button style={{ width: "100%", color: "dimgray" }} onClick={async () => { 
                            try{ 
                                await serverRPC("sign_out", {
                                    p_uid: authUser.isAuthUser.id,
                                    platform: "codingwithrand"
                                }, userSession.data.session.access_token);
                                await auth.signOut() 
                                window.location.replace("/registration")
                            }catch(e){ console.error(e) } 
                        }}><b>Logout this session</b></button>
                    </div>

                )
            }
            setSessionComponents(sc);
        })()
    }, [authUser.isAuthUser], 500)
    
    return(
        <>
            {sessionComponents}
            <button onClick={async () => {
                try{
                    const userSession = await supabase.auth.getSession();
                    const platforms = ["codingwithrand", "cwr-education", "planreminder"];
                    for(const platform of platforms){
                        await serverRPC("sign_out", {
                            p_uid: authUser.isAuthUser.id,
                            platform: platform
                        }, userSession.data.session.access_token);
                    }
                    await auth.signOut();
                    window.location.replace("/registration");
                }catch(e){
                    console.error(e);
                }
            }} style={{ fontSize: "2rem", color: "red", width: "100%" }}>Logout all sessions</button>
        </>
    )
}

function AuthenticationManagementPanel() {
    return (
        <Section id="amp" themed style="pallete" title="Authentication Management Panel" description="You can manage your account's login session here, you can log out any sessions you want.">
            <b className="theme text-color">Current Sessions</b>
            <SessionsInfo />
        </Section>
    )
}

function UpdateUsername() {
    const { authUser } = useGlobal();
    const [userName, setUserName] = useState("");
    const [isValid, validate] = useState()
    async function changeDisplayName(e){
        e.preventDefault();
        if(isValid){ 
            const userSession = await supabase.auth.getSession();
            await serverUpdate("users-details", { display_name: userName }, { columnName: "uid", value: authUser.isAuthUser.id }, userSession.data.session.access_token);
            window.location.reload();
        }
    }
    return(
        <Section id="uu" themed style="pallete" title="Display Name" description="Change your display name here">
            <form className="display-name setting-submitting-form" onSubmit={changeDisplayName}>
                <InputField 
                    name="username" required errDetector
                    detectorCls="un" type="text" themed
                    placeholder="Your desire username here"
                    onChange={{
                        binded: true,
                        expected_condition: [0, 1],
                        run_test: (e) => {
                            const NamePattern = /^[^\_][\w\s]+[^\s\W\_]$/g;
                            if(NamePattern.test(e.target.value) && e.target.value.length > 2) return 0
                            else return 1
                        },
                        actions: [
                            (e) => { 
                                validate(true);
                                setUserName(e.target.value);
                            },
                            (e) => { 
                                validate(false) 
                                setUserName("");
                            }
                        ]
                    }}
                    warningMsg={["", "Name doesn't satisfy the format (At least 3 character, must be English, doesn't contain special character except \"_\", and doesn't start with \"_\")"]}
                />
                <input className="submit-btn" type="submit" />
            </form>
        </Section>
    )
}

function UpdatePassword() {
    const { authUser } = useGlobal();
    const [inputType, setInputType] = useState("password");
    const [passConfirmed, checkPass] = useState(true);
    const [result, debug] = useState(false);
    const [userPass, setUserPass] = useState("");
    const oldPassword = useRef();

    const [dialogMessages, setDM] = useState({
        title: "",
        subtitle: "",
        description: ""
    })

    async function changePassword(e){
        e.preventDefault();
        if(passConfirmed) return;
        try{
            const { data, error } = await auth.signInWithPassword({ email: authUser.isAuthUser.email, password: oldPassword.current });
            if(error) throw error;
            const { data2, error2 } = await auth.updateUser({ password: userPass });
            if(error2) throw error2;
            setDM({title: "Successfully Changing your password", subtitle: "You're good to go now", description: ""}); debug(true);
        } catch (error) {
            if(error.message === "Invalid login credentials") {
                setDM({title: "Changing Password failed", subtitle: "Please input the correct previous password", description: ""})
            } else {
                setDM({title: "Changing Password failed", subtitle: "Something went wrong, please try again later!", description: ""})
            }
            debug(true);
            console.error(error)
        }
    }
    
    return(
        <Section id="up" themed style="pallete" title="Password" description="Change your password here">
            <form className="password setting-submitting-form" onSubmit={changePassword}>
                <InputField 
                    name="password" type={inputType} themed required placeholder="Your old password here"
                    onChange={{
                        binded: true,
                        expected_condition: [0],
                        run_test: (e) => 0,
                        actions: [(e) => { oldPassword.current = e.target.value; }]
                    }}
                />
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
                    <Switch id="id1" cls="specific" mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")}/>
                    <label className="field-label responsive">Show Password</label>
                    <span className="forget-password responsive" onClick={async () => {
                        await auth.resetPasswordForEmail(authUser.isAuthUser.email) 
                        debug(true);
                        setDM((prevDM) => ({...prevDM, title: "Password reset email has been sent!", subtitle: "Please check your email inbox!", description: ""}))
                    }}>Forgot your password? Reset it here</span>
                </div>
                <button className="submit-btn responsive" type="submit" disabled={passConfirmed}>Submit</button>
            </form>
            <AlertBox themed id="password-change-alert-box" detect={result} messages={{
                title: dialogMessages.title,
                subtitle: dialogMessages.subtitle,
                description: dialogMessages.description,
                action: "OK"
            }}
            action={() => {debug(false);}} />
        </Section>
    )
}

function UpdateProfilePicture(){
    const { authUser } = useGlobal();
    const clientPPFLink = useRef();
    const [ fileName, setFileName ] = useState("")
    async function uploadPPF(e){
        e.preventDefault();
        try{
            const { data, error } = await storage.from("user-pfp").upload(`${authUser.isAuthUser.id}/profile.png`, clientPPFLink.current, { upsert: true });
            if(error) throw error
        }catch(err){ console.error(err) }
        window.location.reload();
    }

    return(
        <Section id="upfp" themed style="pallete" cssstyle={{ marginTop: "4em" }} title="Profile Picture" description="Change your profile picture here">
            <form className="ppf setting-submitting-form" onSubmit={uploadPPF}>
                <div className="profile-picture-upload-section">
                    <input className="theme text-color" type="file" id="pfp" name="pfp" style={{ display: "none" }} accept="image/png, image/jpeg" onChange={(e) => {
                        clientPPFLink.current = new File([e.target.files[0]], "profile.png", { type: "image/png" })
                        setFileName(e.target.files[0].name)
                    }}/>
                    <label className="submit-btn" style={{ display: "block", textAlign: "center" }} htmlFor="pfp">Upload</label>
                    <span className="theme text-color">{fileName}</span>
                </div>
                <input className="submit-btn" type="submit" />
            </form>
        </Section>
    )
}

function Username(){
    const { authUser } = useGlobal();
    const [ showingUsername, setShowingUsername ] = useState();

    useEffect(() => {
        (async () => {
            if(authUser.isAuthUser) {
                const name = await supabase.schema("public").from("users-details").select("display_name").eq("uid", authUser.isAuthUser.id);
                setShowingUsername(name.data[0].display_name);
            }
        })()
    }, [authUser.isAuthUser])

    return <li className="text-sm sm:text-base">{showingUsername}</li>
}

function SignOutBTN() {
    const { authUser } = useGlobal();

    return <button onClick={async () => {
        const userSession = await supabase.auth.getSession();
        await serverRPC("sign_out", {
            p_uid: authUser.isAuthUser.id,
            platform: "codingwithrand"
        }, userSession.data.session.access_token);

        await auth.signOut();
        window.location.replace("/registration");
    }}><Image name="exit.png" dir="icon/" width={35} height={35} /></button>
}

export default function AccountSettings() {

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

    useEffect(() => {
        (async () => {
            await All.Functions.jobDelay(() => {
                try { document.querySelector('#account-settings-iframe').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 1000)
        })();
    }, []);

    return(
        <div className="page-container spaceship-cockpit-panel">
            <iframe id="account-settings-iframe" className="crossite-iframe">
                <nav id="navbar">
                    <ul>
                        <li className="text-md sm:text-lg">Welcome!</li>
                        <Username />
                    </ul>
                    <ul>
                        <All.Components.PreventCrossSiteComponent>
                            <All.Components.ThemeChanger />
                        </All.Components.PreventCrossSiteComponent>
                        <button onClick={menuBtn}>
                            <All.Components.UserPFP />
                        </button>
                        <All.Components.PreventCrossSiteComponent>
                            <li className="flex justify-center"><SignOutBTN /></li>
                        </All.Components.PreventCrossSiteComponent>
                    </ul>
                    <ul id="menu-dropdown" style={{display: "none", right: "4rem"}}>
                        <li><a href="/settings/#upfp">Profile Picture</a></li>
                        <li><a href="/settings/#uu">Username</a></li>
                        <li><a href="/settings/#up">Password</a></li>
                        <li><a href="/settings/#amp">Auth Panel</a></li>
                        <li><a href="/">
                        Back to Home&nbsp;
                        <Image style={{display: "inline"}} width="20" height="20" name="exit.png" dir="icon/"/>
                        </a></li>
                    </ul>
                </nav>
                <main className="flex items-center flex-col">
                    <UpdateProfilePicture />
                    <UpdateUsername />
                    <UpdatePassword />
                    <AuthenticationManagementPanel />
                </main>
            </iframe>
            <All.Components.HyperspaceTeleportationBackground />
            <BgMusicController />
        </div>
    )
}