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

function EditPowerSystemPage() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditPowerSystemPage/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [uses, setUses] = useState([]);
    const [notableUsers, setNotableUsers] = useState([]);
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/PowerSystems/${id}`;

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
                window.location.href.split("EditPowerSystemPage/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(manualOfStyle, id, "ManualOfStyle");
        handleCheckEmptyArray(blurb, id, "Blurb");
        handleCheckEmptyArray(info, id, "Info");
        handleCheckEmptyArray(uses, id, "Uses");
        handleCheckEmptyArray(notableUsers, id, "NotableUsers");
    }, [edited, manualOfStyle, blurb, info, uses, notableUsers]);

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

    function handleInfoEdit(inputArray) {
        setEdited(true);
        setInfo({
            contentType: "Info",
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

    function handleNotableUsersEdit(inputArray) {
        setEdited(true);
        setNotableUsers({
            contentType: "NotableUsers",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}ManualOfStyle`);
        localStorage.removeItem(`${id}Blurb`);
        localStorage.removeItem(`${id}Info`);
        localStorage.removeItem(`${id}Uses`);
        localStorage.removeItem(`${id}NotableUsers`);
        localStorage.removeItem(`${id}Edited`);
        localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
        localStorage.removeItem(`${id}BlurbGrabbed`);
        localStorage.removeItem(`${id}InfoGrabbed`);
        localStorage.removeItem(`${id}UsesGrabbed`);
        localStorage.removeItem(`${id}NotableUsersGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleManualOfStyleSubmit() {
        setProgress(10);
        await replaceImage(
            manualOfStyle,
            "PowerSystemInfo",
            "ManualOfStyle",
            id
        );
        await updateData(path, "ManualOfStyle", manualOfStyle);
        setProgress(20);
    }

    async function handleBlurbSubmit() {
        setProgress(30);
        await replaceImage(blurb, "PowerSystemInfo", "Blurb", id);
        await updateData(path, "Blurb", blurb);
        setProgress(40);
    }

    async function handleInfoSubmit() {
        setProgress(50);
        await replaceImage(info, "PowerSystemInfo", "Info", id);
        await updateData(path, "Info", info);
        setProgress(60);
    }

    async function handleUsesSubmit() {
        setProgress(70);
        await replaceImage(uses, "PowerSystemInfo", "Uses", id);
        await updateData(path, "Uses", uses);
        setProgress(80);
    }

    async function handleNotableUsersSubmit() {
        setProgress(90);
        await replaceImage(notableUsers, "PowerSystemInfo", "NotableUsers", id);
        await updateData(path, "NotableUsers", notableUsers);
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
            await handleInfoSubmit();
            await handleUsesSubmit();
            await handleNotableUsersSubmit();
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
                    <div>
                        <div>
                            <h2>Edit Info</h2>
                            <ContentForm
                                handleFormContents={handleInfoEdit}
                                isManualOfStyle={false}
                                section={"Info"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
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
                        <div>
                            <h2>Edit Notable Users</h2>
                            <ContentForm
                                handleFormContents={handleNotableUsersEdit}
                                isManualOfStyle={false}
                                section={"NotableUsers"}
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
            <Link to={`/PowerSystem/${id}`}>Back</Link>
        </>
    );
}

export default EditPowerSystemPage;
