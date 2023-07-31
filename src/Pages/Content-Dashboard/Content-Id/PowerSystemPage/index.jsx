import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../helpers";
import { DisplayContent } from "../../../../components";
import { firebase_app, getData } from "../../../../firebase";

function PowerSystemPage() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("PowerSystem/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [uses, setUses] = useState([]);
    const [notableUsers, setNotableUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [hideButton, setHideButton] = useState(true);

    const path = `/Content/PowerSystems/${id}`;

    async function grabContent() {
        const manualOfStyle = await getData(path, "ManualOfStyle");
        if (manualOfStyle) {
            setManualOfStyle(manualOfStyle);
        }
        const blurb = await getData(path, "Blurb");
        if (blurb) {
            setBlurb(blurb);
        }
        const info = await getData(path, "Info");
        if (info) {
            setInfo(info);
        }
        const uses = await getData(path, "Uses");
        if (uses) {
            setUses(uses);
        }
        const notableUsers = await getData(path, "NotableUsers");
        if (notableUsers) {
            setNotableUsers(notableUsers);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setId(
            deletePartOfString(
                window.location.href.split("PowerSystem/")[1],
                "/"
            )
        );
        grabContent();
    }, [id]);

    function handleEdit() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate(`/EditPowerSystemPage/${id}`);
            } else {
                setMessage("You must be logged in to edit content.");
                setHideButton(false);
            }
        });
    }


    function handlePageContent() {
        return (
            <div>
                <div>
                    <div style={{ display: "flex" }}>
                        <h1>{id.replace(",", " ")}</h1>
                        <button onClick={handleEdit}>Edit Page</button>
                    </div>
                    <div>{message}</div>
                    {hideButton === false ? (
                        <Link to={"/login"}>Login</Link>
                    ) : (
                        <div />
                    )}
                </div>
                <div
                    className="HeroWrapper"
                    style={{ display: "flex", flexDirection: "row-reverse" }}
                >
                    <div style={{ width: "50%" }}>
                        <DisplayContent
                            array={manualOfStyle}
                            isManualOfStyle={true}
                        />
                    </div>
                    <div style={{ width: "50%" }}>
                        <DisplayContent array={blurb} isManualOfStyle={false} />
                    </div>
                </div>
                <div>
                    <div>
                        <DisplayContent array={info} isManualOfStyle={false} />
                    </div>
                    <div>
                        <DisplayContent array={uses} isManualOfStyle={false} />
                    </div>
                    <div>
                        <DisplayContent
                            array={notableUsers}
                            isManualOfStyle={false}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
            <Link to={`/content`}>Back</Link>
        </>
    );
}

export default PowerSystemPage;
