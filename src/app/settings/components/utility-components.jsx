import { useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import { useLoadingState } from "@/glient/loading";
import Client from "@/glient/util";
import Cookies from "universal-cookie";
import { serverFetch, auth } from "@/glient/supabase";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export function Username(){
    const { authUser } = useGlobal();
    const [ showingUsername, setShowingUsername ] = useState();

    useEffect(() => {
        (async () => {
            if(authUser.isAuthUser) {
                const name = await serverFetch("users-details", "display_name", { columnName: "uid", value: authUser.isAuthUser.id });
                setShowingUsername(name[0].display_name);
            }
        })()
    }, [authUser.isAuthUser])

    return <li className="text-sm sm:text-base">{showingUsername}</li>
}

export function SignOutBTN() {
    const setLoadingState = useLoadingState();
    const cookies = new Cookies();

    return <button onClick={async () => {
        setLoadingState(true);
        await auth.signOut();
        setLoadingState(false);
        window.location.replace("/registration");
    }}><Image name="exit.png" dir="icon/" width={35} height={35} /></button>
}