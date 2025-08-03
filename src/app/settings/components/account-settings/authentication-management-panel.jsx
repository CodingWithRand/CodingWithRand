import { useEffect, useState } from "react"
import Client from "@/glient/util";
import Loading, { useLoadingState } from "@/glient/loading";
import { useGlobal } from "@/glient/global";
import { auth, serverRPC, supabase } from "@/glient/supabase";

const { Section } = Client.Components.Dynamic;

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
    const setLoadingState = useLoadingState();

    Client.Hooks.useDelayedEffect(() => {
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

    useEffect(() => {
        if(sessionComponents.length === 0) setLoadingState(true);
        else setLoadingState(false);
    }, [sessionComponents])
    
    return(
        <Loading cover>
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
        </Loading>
    )
}

export default function AuthenticationManagementPanel() {
    return (
        <Section id="amp" themed style="pallete" title="Authentication Management Panel" description="You can manage your account's login session here, you can log out any sessions you want.">
            <b className="theme text-color">Current Sessions</b>
            <SessionsInfo />
        </Section>
    )
}