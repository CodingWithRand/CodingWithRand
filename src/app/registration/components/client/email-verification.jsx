import Client from "@/glient/util";
import "./client.css"
import { useEffect, useState } from "react";
// import { reload, sendEmailVerification } from "firebase/auth";
// import { auth } from "../../../../../firebaseStuff (Unused)/firebase";
import { useGlobal } from "@/glient/global";
import Neutral from "@/app/global/neutral/util";
import Cookies from "universal-cookie";
import { auth } from "@/glient/supabase";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export default function EmailVerifificationPage(props) {
    const [ timer, countdown ] = useState(60);
    const [ btnState, setBtnState ] = useState(true);
    const { authUser } = useGlobal();

    // Client.Hooks.useDelayedEffect(() => {
    //     if(login.isLoggedIn && auth.currentUser?.emailVerified) if(window === window.parent) window.location.replace("/");
    // }, [login.isLoggedIn, auth.currentUser?.emailVerified], 1000);

    Client.Hooks.useDelayedEffect(() => {
        if(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at !== null){
            console.log('verified');
            window.location.replace("/")
        }
    }, [authUser.isAuthUser], 1000)
    
    useEffect(() => {
        (async () => {
            await Neutral.Functions.asyncDelay(1000);
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