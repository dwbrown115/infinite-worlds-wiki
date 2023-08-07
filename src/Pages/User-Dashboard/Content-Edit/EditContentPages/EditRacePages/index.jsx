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

function EditRacePage() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("EditRacePage/")[1], "/")
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
    const [culture, setCulture] = useState([]);
    const [history, setHistory] = useState([]);
    const [notableMembers, setNotableMembers] = useState([]);
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/Race/${id}`;

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
                window.location.href.split("EditRacePage/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(manualOfStyle, id, "ManualOfStyle");
        handleCheckEmptyArray(blurb, id, "Blurb");
        handleCheckEmptyArray(characteristics, id, "Characteristics");
        handleCheckEmptyArray(culture, id, "Culture");
        handleCheckEmptyArray(history, id, "History");
        handleCheckEmptyArray(notableMembers, id, "NotableMembers");
    }, [
        edited,
        manualOfStyle,
        blurb,
        characteristics,
        culture,
        history,
        notableMembers,
    ]);

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

    function handleCharacteristicsEdit(inputArray) {
        setEdited(true);
        setCharacteristics({
            contentType: "Characteristics",
            content: inputArray,
        });
    }

    function handleCultureEdit(inputArray) {
        setEdited(true);
        setCulture({
            contentType: "Culture",
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

    function handleNotableMembersEdit(inputArray) {
        setEdited(true);
        setNotableMembers({
            contentType: "NotableMembers",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}ManualOfStyle`);
        localStorage.removeItem(`${id}Blurb`);
        localStorage.removeItem(`${id}Characteristics`);
        localStorage.removeItem(`${id}Culture`);
        localStorage.removeItem(`${id}History`);
        localStorage.removeItem(`${id}NotableMembers`);
        localStorage.removeItem(`${id}Edited`);
        localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
        localStorage.removeItem(`${id}BlurbGrabbed`);
        localStorage.removeItem(`${id}CharacteristicsGrabbed`);
        localStorage.removeItem(`${id}CultureGrabbed`);
        localStorage.removeItem(`${id}HistoryGrabbed`);
        localStorage.removeItem(`${id}NotableMembersGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleManualOfStyleSubmit() {
        setProgress(8.33);
        await replaceImage(manualOfStyle, "RaceInfo", "ManualOfStyle", id);
        await updateData(path, "ManualOfStyle", manualOfStyle);
        setProgress(16.66);
    }

    async function handleBlurbSubmit() {
        setProgress(25);
        await replaceImage(blurb, "RaceInfo", "Blurb", id);
        await updateData(path, "Blurb", blurb);
        setProgress(33.33);
    }

    async function handleCharacteristicsSubmit() {
        setProgress(41.66);
        await replaceImage(characteristics, "RaceInfo", "Characteristics", id);
        await updateData(path, "Characteristics", characteristics);
        setProgress(50);
    }

    async function handleCultureSubmit() {
        setProgress(58.33);
        await replaceImage(culture, "RaceInfo", "Culture", id);
        await updateData(path, "Culture", culture);
        setProgress(66.66);
    }

    async function handleHistorySubmit() {
        setProgress(75);
        await replaceImage(history, "RaceInfo", "History", id);
        await updateData(path, "History", history);
        setProgress(83.33);
    }

    async function handleNotableMembersSubmit() {
        setProgress(91.66);
        await replaceImage(notableMembers, "RaceInfo", "NotableMembers", id);
        await updateData(path, "NotableMembers", notableMembers);
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
            await handleCharacteristicsSubmit();
            await handleCultureSubmit();
            await handleHistorySubmit();
            await handleNotableMembersSubmit();
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
                <h1>Edit {replacePartOfAString(id, ",", " ")}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <hr />
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
                        <div>
                            <h2>Edit Characteristics</h2>
                            <ContentForm
                                handleFormContents={handleCharacteristicsEdit}
                                isManualOfStyle={false}
                                section={"Characteristics"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Edit Culture</h2>
                            <ContentForm
                                handleFormContents={handleCultureEdit}
                                isManualOfStyle={false}
                                section={"Culture"}
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
                            <h2>Edit Notable Members</h2>
                            <ContentForm
                                handleFormContents={handleNotableMembersEdit}
                                isManualOfStyle={false}
                                section={"NotableMembers"}
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
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
            {uploading ? (
                <div>
                    <ProgressBar percentage={progress} />
                    <h1>Uploading...</h1>
                    <br />
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
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
                </div>
            )}
            <Link to={`/Race/${id}`}>Back</Link>
        </div>
    );
}

export default EditRacePage;
