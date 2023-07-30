import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../helpers";
import { DisplayContent } from "../../../../components";
import { firebase_app, getData } from "../../../../firebase";

function FactionPage() {
    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Faction/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [history, setHistory] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const path = `/Content/Factions/${id}`;

    async function grabContent() {
        const manualOfStyle = await getData(path, "ManualOfStyle");
        if (manualOfStyle) {
            setManualOfStyle(manualOfStyle);
        }
        const blurb = await getData(path, "Blurb");
        if (blurb) {
            setBlurb(blurb);
        }
        const history = await getData(path, "History");
        if (history) {
            setHistory(history);
        }
        const objectives = await getData(path, "Objectives");
        if (objectives) {
            setObjectives(objectives);
        }
        const members = await getData(path, "Members");
        if (members) {
            setMembers(members);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setId(
            deletePartOfString(window.location.href.split("Faction/")[1], "/")
        );
        grabContent();
    }, [id]);

    function handlePageContent() {
        return (
            <div>
                <h1>{id.replace(",", " ")}</h1>
                <div>
                    <div
                        className="HeroWrapper"
                        style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                        }}
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
                            <DisplayContent
                                array={blurb}
                                isManualOfStyle={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="HistoryWrapper">
                    <DisplayContent array={history} isManualOfStyle={false} />
                </div>
                <div className="ObjectivesWrapper">
                    <DisplayContent
                        array={objectives}
                        isManualOfStyle={false}
                    />
                </div>
                <div className="MembersWrapper">
                    <DisplayContent array={members} isManualOfStyle={false} />
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

export default FactionPage;
