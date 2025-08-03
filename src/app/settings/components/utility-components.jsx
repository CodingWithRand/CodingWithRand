import { useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import { useLoadingState } from "@/glient/loading";
import Client from "@/glient/util";
import { auth, serverRPC, supabase } from "@/glient/supabase";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export function Username(){
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

export function SignOutBTN() {
    const { authUser } = useGlobal();
    const setLoadingState = useLoadingState();

    return <button onClick={async () => {
        setLoadingState(true);
        const userSession = await supabase.auth.getSession();
        await serverRPC("sign_out", {
            p_uid: authUser.isAuthUser.id,
            platform: "codingwithrand"
        }, userSession.data.session.access_token);

        await auth.signOut();
        setLoadingState(false);
        window.location.replace("/registration");
    }}><Image name="exit.png" dir="icon/" width={35} height={35} /></button>
}