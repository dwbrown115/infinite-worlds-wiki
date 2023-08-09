import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
    Loading,
    deletePartOfString,
    replacePartOfAString,
} from "../../../../../helpers";
import { DisplayContent } from "../../../../../components";
import firebase_app from "../../../../../firebase/config";
import getData from "../../../../../firebase/firestore/getData";

function CharacterInfo() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Character/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [powersAndAbilities, setPowersAndAbilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [hideButton, setHideButton] = useState(true);

    const path = `/Content/Characters/${id}`;

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
        const equipment = await getData(path, "Equipment");
        if (equipment) {
            setEquipment(equipment);
        }
        const powersAndAbilities = await getData(path, "PowersAndAbilities");
        if (powersAndAbilities) {
            setPowersAndAbilities(powersAndAbilities);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setId(
            deletePartOfString(window.location.href.split("Character/")[1], "/")
        );
        grabContent();
    }, [id]);

    function handleEdit() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate(`/EditCharacterInfo/${id}`);
            } else {
                setMessage("You must be logged in to edit this content.");
                setHideButton(false);
            }
        });
    }

    function handlePageContent() {
        return (
            <div className="CharacterInfo">
                <div>
                    <br />
                    <Link to={`/Character/${id}/Synopsis`}>Synopsis</Link>
                    <Link to={`/Character/${id}/Relationships`}>
                        Relationships
                    </Link>
                </div>
                <div>
                    <div style={{ display: "flex" }}>
                        <h1>{replacePartOfAString(id, ",", " ")}</h1>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <button onClick={handleEdit}>Edit Page</button>
                        </div>
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
                    <div
                        className="ManualOfStyleWrapper"
                        style={{ width: "50%" }}
                    >
                        <DisplayContent
                            array={manualOfStyle}
                            isManualOfStyle={true}
                        />
                    </div>
                    <div className="BlurbWrapper" style={{ width: "50%" }}>
                        <DisplayContent array={blurb} isManualOfStyle={false} />
                    </div>
                </div>
                <div className="InfoWrapper">
                    <DisplayContent array={info} isManualOfStyle={false} />
                </div>
                <div className="EquipmentWrapper">
                    <h2>Equipment</h2>
                    <DisplayContent array={equipment} isManualOfStyle={false} />
                </div>
                <div className="PowersAndAbilitiesWrapper">
                    <h2>Powers and Abilities</h2>
                    <DisplayContent
                        array={powersAndAbilities}
                        isManualOfStyle={false}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </div>
    );
}

export default CharacterInfo;
