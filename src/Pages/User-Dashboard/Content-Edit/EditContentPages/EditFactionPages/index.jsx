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

function EditFactionPage() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditFactionPage/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [history, setHistory] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [members, setMembers] = useState([]);
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/Factions/${id}`;

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
                window.location.href.split("EditFactionPage/")[1],
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
        handleCheckEmptyArray(objectives, id, "Objectives");
        handleCheckEmptyArray(members, id, "Members");
    }, [edited, manualOfStyle, blurb, history, objectives, members]);

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

    function handleHistoryEdit(inputArray) {
        setEdited(true);
        setHistory({
            contentType: "History",
            content: inputArray,
        });
    }

    function handleObjectivesEdit(inputArray) {
        setEdited(true);
        setObjectives({
            contentType: "Objectives",
            content: inputArray,
        });
    }

    function handleMembersEdit(inputArray) {
        setEdited(true);
        setMembers({
            contentType: "Members",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}ManualOfStyle`);
        localStorage.removeItem(`${id}Blurb`);
        localStorage.removeItem(`${id}History`);
        localStorage.removeItem(`${id}Objectives`);
        localStorage.removeItem(`${id}Members`);
        localStorage.removeItem(`${id}Edited`);
        localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
        localStorage.removeItem(`${id}BlurbGrabbed`);
        localStorage.removeItem(`${id}HistoryGrabbed`);
        localStorage.removeItem(`${id}ObjectivesGrabbed`);
        localStorage.removeItem(`${id}MembersGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleManualOfStyleSubmit() {
        setProgress(10);
        await replaceImage(manualOfStyle, "FactionInfo", "ManualOfStyle", id);
        await updateData(path, "ManualOfStyle", manualOfStyle);
        setProgress(20);
    }

    async function handleBlurbSubmit() {
        setProgress(30);
        await replaceImage(blurb, "FactionInfo", "Blurb", id);
        await updateData(path, "Blurb", blurb);
        setProgress(40);
    }

    async function handleHistorySubmit() {
        setProgress(50);
        await replaceImage(history, "FactionInfo", "History", id);
        await updateData(path, "History", history);
        setProgress(60);
    }

    async function handleObjectivesSubmit() {
        setProgress(70);
        await replaceImage(objectives, "FactionInfo", "Objectives", id);
        await updateData(path, "Objectives", objectives);
        setProgress(80);
    }

    async function handleMembersSubmit() {
        setProgress(90);
        await replaceImage(members, "FactionInfo", "Members", id);
        await updateData(path, "Members", members);
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
            await handleHistorySubmit();
            await handleObjectivesSubmit();
            await handleMembersSubmit();
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
                    </div>
                    <div>
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
                        <div>
                            <h2>Edit Objectives</h2>
                            <ContentForm
                                handleFormContents={handleObjectivesEdit}
                                isManualOfStyle={false}
                                section={"Objectives"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
                        <div>
                            <h2>Edit Members</h2>
                            <ContentForm
                                handleFormContents={handleMembersEdit}
                                isManualOfStyle={true}
                                section={"Members"}
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
            <Link to={`/Faction/${id}`}>Back</Link>
        </>
    );
}

export default EditFactionPage;
