import { useRef, useState } from "react";
import { useGlobal } from "@/glient/global";
import { storage, supabase } from "@/glient/supabase";
import Client from "@/app/global/client/util";

const { Section } = Client.Components.Dynamic;

export default function UpdateProfilePicture(){
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
        <Section themed style="pallete" title="Profile Picture" description="Change your profile picture here">
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