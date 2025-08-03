import { useState } from "react";
import { useGlobal } from "@/glient/global";
import Client from "@/glient/util";
import { serverUpdate, supabase } from "@/glient/supabase";

const { InputField, Section } = Client.Components.Dynamic;

export default function UpdateUsername() {
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