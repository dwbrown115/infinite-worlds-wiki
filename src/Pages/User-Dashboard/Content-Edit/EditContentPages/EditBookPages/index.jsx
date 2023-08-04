import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";

import { ContentForm } from "../../../../../components";
import {
    Loading,
    deletePartOfString,
    replaceImage,
    ProgressBar,
    replacePartOfAString,
    handleCheckEmptyArray,
    setBackupArray,
} from "../../../../../helpers";
import {
    addData,
    firebase_app,
    getData,
    updateData,
} from "../../../../../firebase";

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
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [optional, setOptional] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/Books/${id}`;

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setTimeout(() => {
                setReset(false);
                setConfirm(false);
            }, 1);
        }
    }

    async function grabUser() {
        const collection = "/users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const userSnap = await getData(collection, id);
        if (userSnap) {
            setEmail(userSnap.email);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setId(
            deletePartOfString(
                window.location.href.split("EditBookPage/")[1],
                "/"
            )
        );
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

    async function handleManualOfStyleSubmit() {
        setProgress(0);
        await replaceImage(manualOfStyle, "BookInfo", "ManualOfStyle", id);
        await updateData(path, "ManualOfStyle", manualOfStyle);
        await setBackupArray(id, "ManualOfStyle", path);
        localStorage.removeItem(`${id}ManualOfStyle`);
        setProgress(12.5);
    }

    async function handleBlurbSubmit() {
        setProgress(25);
        const backupArray = await setBackupArray(id, "Blurb", path);
        await replaceImage(blurb, "BookInfo", "Blurb", id);
        await addData(path, "Blurb", blurb);
        await setBackupArray(id, "Blurb", path);
        localStorage.removeItem(`${id}Blurb`);
        setProgress(37.5);
    }

    async function handleSynopsisSubmit() {
        setProgress(50);
        const backupArray = await setBackupArray(id, "Synopsis", path);
        await replaceImage(synopsis, "BookInfo", "Synopsis", id);
        await addData(path, "Synopsis", synopsis);
        await setBackupArray(id, "Synopsis", path);
        localStorage.removeItem(`${id}Synopsis`);
        setProgress(62.5);
    }

    async function handleChaptersSubmit() {
        setProgress(75);
        if (optional == true) {
            const backupArray = await setBackupArray(id, "Chapters", path);
            await replaceImage(chapters, "BookInfo", "Chapters", id);
            await addData(path, "Chapters", chapters);
            await setBackupArray(id, "Chapters", path);
            localStorage.removeItem(`${id}Chapters`);
        }
        setProgress(87.5);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setUploading(true);
        const time = Date().toLocaleString();
        let array = await getData("/ContentRef", id);
        // const contentRef = doc(db, "ContentRef", id);
        // console.log(array)
        const updatedAt = { updatedAt: time, updatedBy: email };
        array = { ...array, timeStampArray: arrayUnion(updatedAt) };
        try {
            await updateData("/ContentRef", id, array);
            await handleManualOfStyleSubmit();
            await handleBlurbSubmit();
            await handleSynopsisSubmit();
            await handleChaptersSubmit();
            localStorage.removeItem(`${id}Edited`);
            localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
            localStorage.removeItem(`${id}SynopsisGrabbed`);
            localStorage.removeItem(`${id}BlurbGrabbed`);
            localStorage.removeItem(`${id}ChaptersGrabbed`);
        } catch (e) {
            console.log(e);
        }
        setProgress(100);
        setUploading(false);
        setTimeout(() => {
            setProgress(0);
            // router(0);
        }, 100);
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
        // setBackupArray(id, "ManualOfStyle", path);
        // console.log(jsonParser(localStorage));
        console.log(localStorage);
    }

    function clear() {
        localStorage.clear();
        router(0);
    }

    function handlePageContent() {
        return (
            <div>
                <button onClick={test}>Test</button>
                <button onClick={clear}>Clear</button>
                <hr />
                <h1>Edit {replacePartOfAString(id, ",", " ")}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
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
                        <hr />
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
                    </div>
                    <hr />
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
                    <hr />
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
                    <hr />
                    <button type="submit">Submit</button>
                    <br />
                    <br />
                </form>
            </div>
        );
    }
    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
            {uploading ? (
                <div>
                    <ProgressBar percentage={progress} />
                    <h1>Uploading...</h1>
                    <br />
                </div>
            ) : (
                <>
                    {reset === false ? (
                        <div>
                            <button
                                onClick={() => {
                                    setReset(true);
                                }}
                            >
                                Reset All
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => setReset(false)}>
                                Cancel reset
                            </button>
                            <button onClick={handleResetConfirm}>
                                Confirm reset
                            </button>
                        </div>
                    )}
                    <br />
                </>
            )}
            <Link to={`/Book/${id}`}>Back</Link>
        </>
    );
}

export default EditBookPage;
