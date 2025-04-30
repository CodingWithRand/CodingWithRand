import { useEffect, useState } from "react"
import Client from "@/glient/util";
import Loading, { useLoadingState } from "@/glient/loading";
import { useGlobal } from "@/glient/global";
import { auth, serverFetch } from "@/glient/supabase";

const { Section } = Client.Components.Dynamic;

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
            let sc;
            const userData = await serverFetch("users-details", "*", { columnName: "uid", value: authUser.isAuthUser.id });
            const locationResponse = await fetch(`https://ipwho.is/${userData[0].ip}`);
            const location = await locationResponse.json();
            sc = <div className="session-info theme text-color" id="codingwithrand">
                    <h3>Main Website</h3>
                    <a href={window.location.origin}><b>URL: </b>{window.location.origin}</a>
                    <dl>
                        <dt><i><b>Issued at:</b></i></dt>
                        <dd>{userData[0].created_at}</dd>
                        <dt><i><b>Login location:</b></i></dt>
                        <dd>{`${location.city}, ${location.region}, ${location.country}, ${location.continent}`}</dd>
                        <dt><i><b>Internet IP:</b></i></dt>
                        <dd>{userData[0].ip}</dd>
                    </dl>
                    <button style={{ width: "100%", color: "dimgray" }} onClick={async () => { 
                        try{ 
                            await auth.signOut() 
                            window.location.replace("/registration")
                        }catch(e){ console.error(e) } 
                    }}><b>Logout this session</b></button>
                </div>

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
        </Loading>
    )
}

export default function AuthenticationManagementPanel() {
    return (
        <Section themed style="pallete" title="Authentication Management Panel" description="You can manage your account's login session here, you can log out any sessions you want.">
            <b>Current Sessions</b>
            <SessionsInfo />
        </Section>
    )
}