import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../../helpers";
import { DisplayContent } from "../../../../../components";
import firebase_app from "../../../../../firebase/config";
import getData from "../../../../../firebase/firestore/getData";

function CharacterInfo() {
    const auth = getAuth(firebase_app);

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Character/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [powersAndAbilities, setPowersAndAbilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                <h1>{id.replace(",", " ")}</h1>
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
                <div className="PowersAndAbilitiesWrapper">
                    <DisplayContent
                        array={powersAndAbilities}
                        isManualOfStyle={false}
                    />
                </div>
                <Link to={`/content`}>Back</Link>
            </div>
        );
    }

    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </>
    );
}

export default CharacterInfo;
