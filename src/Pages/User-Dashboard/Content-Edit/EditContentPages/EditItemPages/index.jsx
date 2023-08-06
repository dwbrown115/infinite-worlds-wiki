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
} from "../../../../../helpers";
import { firebase_app, getData, updateData } from "../../../../../firebase";

function EditItemPage() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("EditItemPage/")[1], "/")
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [history, setHistory] = useState([]);
    const [description, setDescription] = useState([]);
    const [uses, setUses] = useState([]);
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/Items/${id}`;

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
                window.location.href.split("EditItemPage/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(manualOfStyle, id, "ManualOfStyle");
        handleCheckEmptyArray(blurb, id, "Blurb");
        handleCheckEmptyArray(history, id, "History");
        handleCheckEmptyArray(uses, id, "Uses");
    }, [edited, manualOfStyle, blurb, history, uses]);

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

    function handleDescriptionEdit(inputArray) {
        setEdited(true);
        setDescription({
            contentType: "Description",
            content: inputArray,
        });
    }

    function handleHistoryEdit(inputArray) {
        setEdited(true);
        setHistory({
            contentType: "History",
            content: inputArray,
        });
    }

    function handleUsesEdit(inputArray) {
        setEdited(true);
        setUses({
            contentType: "Uses",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}ManualOfStyle`);
        localStorage.removeItem(`${id}Blurb`);
        localStorage.removeItem(`${id}History`);
        localStorage.removeItem(`${id}Uses`);
        localStorage.removeItem(`${id}Edited`);
        localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
        localStorage.removeItem(`${id}BlurbGrabbed`);
        localStorage.removeItem(`${id}HistoryGrabbed`);
        localStorage.removeItem(`${id}UsesGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleManualOfStyleSubmit() {
        setProgress(10);
        await replaceImage(manualOfStyle, "ItemInfo", "ManualOfStyle", id);
        await updateData(path, "ManualOfStyle", manualOfStyle);
        setProgress(20);
    }

    async function handleBlurbSubmit() {
        setProgress(30);
        await replaceImage(blurb, "ItemInfo", "Blurb", id);
        await updateData(path, "Blurb", blurb);
        setProgress(40);
    }

    async function handleDescriptionSubmit() {
        setProgress(50);
        await replaceImage(description, "ItemInfo", "Description", id);
        await updateData(path, "Description", description);
        setProgress(60);
    }

    async function handleHistorySubmit() {
        setProgress(70);
        await replaceImage(history, "ItemInfo", "History", id);
        await updateData(path, "History", history);
        setProgress(80);
    }

    async function handleUsesSubmit() {
        setProgress(90);
        await replaceImage(uses, "ItemInfo", "Uses", id);
        await updateData(path, "Uses", uses);
        setProgress(100);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setUploading(true);
        const time = Date().toLocaleString();
        let array = await getData("/ContentRef", id);
        const updatedAt = { updatedAt: time, updatedBy: email };
        array = { ...array, timeStampArray: arrayUnion(updatedAt) };
        try {
            await updateData("/ContentRef", id, array);
            await handleManualOfStyleSubmit();
            await handleBlurbSubmit();
            await handleDescriptionSubmit();
            await handleHistorySubmit();
            await handleUsesSubmit();
        } catch (e) {
            console.log(e);
        }
        setProgress(100);
        setUploading(false);
        setTimeout(() => {
            setProgress(0);
            handleResetConfirm();
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

    function handlePageContent() {
        return (
            <div>
                <hr />
                <h1>Edit {replacePartOfAString(id, ",", " ")}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <h2>Manual of Style</h2>
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
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Edit Description</h2>
                            <ContentForm
                                handleFormContents={handleDescriptionEdit}
                                isManualOfStyle={false}
                                section={"Description"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Edit History</h2>
                            <ContentForm
                                handleFormContents={handleHistoryEdit}
                                isManualOfStyle={false}
                                section={"History"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Edit Uses</h2>
                            <ContentForm
                                handleFormContents={handleUsesEdit}
                                isManualOfStyle={false}
                                section={"Uses"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
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
            <Link to={`/Item/${id}`}>Back</Link>
        </>
    );
}

export default EditItemPage;
