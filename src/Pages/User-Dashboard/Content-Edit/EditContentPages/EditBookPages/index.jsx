import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import {
    Loading,
    deletePartOfString,
    replaceImage,
    ProgressBar,
    replacePartOfAString,
    jsonParser,
    handleCheckEmptyArray,
} from "../../../../../helpers";
import { firebase_app, getData } from "../../../../../firebase";

function EditBookPage() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("EditBookPage/")[1], "/")
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [optional, setOptional] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const path = `/Content/Books/${id}`;

    async function grabUser() {
        const collection = "/users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const userSnap = await getData(collection, id);
        if (userSnap) {
            setEmail(userSnap.email);
        }
    }

    async function grabContent() {
        // const manualOfStyle = await getData(path, "ManualOfStyle");
        // console.log(manualOfStyle);
    }

    useEffect(() => {
        setIsLoading(true);
        // setId(
        //     deletePartOfString(
        //         window.location.href.split("EditBookPage/")[1],
        //         "/"
        //     )
        // );
        // console.log(id);
        grabContent();
        // console.log(localStorage.getItem(`${id}Edited`));
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(manualOfStyle, id, "ManualOfStyle");
        handleCheckEmptyArray(blurb, id, "Blurb");
        handleCheckEmptyArray(synopsis, id, "Synopsis");
        handleCheckEmptyArray(chapters, id, "Chapters");
    }, [edited, manualOfStyle, blurb, synopsis, chapters]);

    function handleManualOfStyleEdit(inputArray) {
        setEdited(true);
        setManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurbEdit(inputArray) {
        setEdited(true);
        setBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleSynopsisEdit(inputArray) {
        setEdited(true);
        setSynopsis({
            contentType: "Synopsis",
            content: inputArray,
        });
    }

    function handleChaptersEdit(inputArray) {
        setEdited(true);
        setChapters({
            contentType: "Chapters",
            content: inputArray,
        });
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    grabUser();
                } else {
                    router("/user/verify");
                }
            } else {
                router("/login");
            }
        });
    }, [user]);

    function test() {
        // localStorage.clear();
        // grabEdit();
        // console.log(localStorage.getItem(`${id}Edited`));
        console.log(jsonParser(localStorage.getItem(`${id}ManualOfStyle`)));
        // console.log(jsonParser(localStorage));
        console.log(localStorage.getItem(`${id}ManualOfStyleGrabbed`));
        // setEdited(true);
        // setEdited(false);
        // if (edited == true) {
        // setEdited(false);
        // } else {
        //     setEdited(true);
        // }
    }

    function clear() {
        localStorage.clear();
    }

    function handlePageContent() {
        return (
            <div>
                <button onClick={test}>Test</button>
                <button onClick={clear}>Clear</button>
                <h1>Edit {replacePartOfAString(id, ",", " ")}</h1>
                <div>
                    <h2>Edit Manual of Style</h2>
                    <ContentForm
                        handleFormContents={handleManualOfStyleEdit}
                        isManualOfStyle={true}
                        section={"ManualOfStyle"}
                        reset={confirm}
                        edited={`${id}Edited`}
                        path={path}
                        contentName={id}
                    />
                </div>
                <div>
                    <h2>Edit Blurb</h2>
                    <ContentForm
                        handleFormContents={handleBlurbEdit}
                        isManualOfStyle={false}
                        section={"Blurb"}
                        reset={confirm}
                        edited={`${id}Edited`}
                        path={path}
                        contentName={id}
                    />
                </div>
                <div>
                    <h2>Edit Synopsis</h2>
                    <ContentForm
                        handleFormContents={handleSynopsisEdit}
                        isManualOfStyle={false}
                        section={"Synopsis"}
                        reset={confirm}
                        edited={`${id}Edited`}
                        path={path}
                        contentName={id}
                    />
                </div>
                <div>
                    <h2>Book Chapters</h2>
                    {optional === true ? (
                        <div>
                            <ContentForm
                                handleFormContents={handleChaptersEdit}
                                isManualOfStyle={true}
                                section={"Chapters"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                            <button onClick={() => setOptional(false)}>
                                Remove Chapters Section
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setOptional(true)}>
                            Add Chapters
                        </button>
                    )}
                </div>
            </div>
        );
    }
    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
            <Link to={`/Book/${id}`}>Back</Link>
        </>
    );
}

export default EditBookPage;
