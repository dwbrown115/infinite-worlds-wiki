import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
    Loading,
    deletePartOfString,
    replacePartOfAString,
} from "../../../../helpers";
import { DisplayContent } from "../../../../components";
import { firebase_app, getData } from "../../../../firebase";

function BookPage() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Book/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [hideButton, setHideButton] = useState(true);

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
        document.title = `${replacePartOfAString(
            id,
            ",",
            " "
        )} || Infinite Worlds Wiki`;
        setId(deletePartOfString(window.location.href.split("Book/")[1], "/"));
        grabContent();
    }, [id]);

    function handleEdit() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate(`/EditBookPage/${id}`);
            } else {
                setMessage("You must be logged in to edit this content.");
                setHideButton(false);
            }
        });
    }

    function handlePageContent() {
        return (
            <div>
                <div>
                    <div>
                        <button onClick={handleEdit}>Edit Page</button>
                    </div>
                    <div style={{ display: "flex" }}>
                        <h1>{replacePartOfAString(id, ",", " ")}</h1>
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
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </div>
    );
}

export default BookPage;
