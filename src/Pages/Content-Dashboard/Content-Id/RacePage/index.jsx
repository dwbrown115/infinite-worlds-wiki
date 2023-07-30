import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../helpers";
import { DisplayContent } from "../../../../components";
import { firebase_app, getData } from "../../../../firebase";

function RacePage() {
    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Race/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
    const [culture, setCulture] = useState([]);
    const [history, setHistory] = useState([]);
    const [notableMembers, setNotableMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const path = `/Content/Race/${id}`;

    async function grabContent() {
        const manualOfStyle = await getData(path, "ManualOfStyle");
        if (manualOfStyle) {
            setManualOfStyle(manualOfStyle);
        }
        const blurb = await getData(path, "Blurb");
        if (blurb) {
            setBlurb(blurb);
        }
        const characteristics = await getData(path, "Characteristics");
        if (characteristics) {
            setCharacteristics(characteristics);
        }
        const culture = await getData(path, "Culture");
        if (culture) {
            setCulture(culture);
        }
        const history = await getData(path, "History");
        if (history) {
            setHistory(history);
        }
        const notableMembers = await getData(path, "NotableMembers");
        if (notableMembers) {
            setNotableMembers(notableMembers);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setId(deletePartOfString(window.location.href.split("Race/")[1], "/"));
        grabContent();
    }, [id]);

    function handlePageContent() {
        return (
            <div>
                <h1>{id.replace(",", " ")}</h1>
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
                        <DisplayContent
                            array={characteristics}
                            isManualOfStyle={false}
                        />
                    </div>
                    <div>
                        <DisplayContent
                            array={culture}
                            isManualOfStyle={false}
                        />
                    </div>
                    <div>
                        <DisplayContent
                            array={history}
                            isManualOfStyle={false}
                        />
                    </div>
                    <div>
                        <DisplayContent
                            array={notableMembers}
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

export default RacePage;
