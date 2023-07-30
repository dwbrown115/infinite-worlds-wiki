import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../helpers";
import { DisplayContent } from "../../../../components";
import { firebase_app, getData } from "../../../../firebase";

function BookPage() {
    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Book/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const path = `/Content/Books/${id}`;

    async function grabContent() {
        const manualOfStyle = await getData(path, "ManualOfStyle");
        if (manualOfStyle) {
            setManualOfStyle(manualOfStyle);
        }
        const chapters = await getData(path, "Chapters");
        if (chapters) {
            setChapters(chapters);
        }
        const blurb = await getData(path, "Blurb");
        if (blurb) {
            setBlurb(blurb);
        }
        const synopsis = await getData(path, "Synopsis");
        if (synopsis) {
            setSynopsis(synopsis);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setId(deletePartOfString(window.location.href.split("Book/")[1], "/"));
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
                            array={chapters}
                            isManualOfStyle={false}
                        />
                    </div>
                    <div>
                        <DisplayContent
                            array={synopsis}
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

export default BookPage;
