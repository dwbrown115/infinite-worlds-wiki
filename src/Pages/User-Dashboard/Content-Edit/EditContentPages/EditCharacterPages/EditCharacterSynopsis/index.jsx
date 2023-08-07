import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";

import { ContentForm } from "../../../../../../components";
import {
    Loading,
    deletePartOfString,
    replaceImage,
    ProgressBar,
    replacePartOfAString,
    handleCheckEmptyArray,
} from "../../../../../../helpers";
import { firebase_app, getData, updateData } from "../../../../../../firebase";
import { func } from "prop-types";

function EditCharacterSynopsis() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditCharacterSynopsis/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [synopsis, setSynopsis] = useState([]);
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/Characters/${id}`;

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
                window.location.href.split("EditCharacterSynopsis/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(synopsis, id, "Synopsis");
    }, [edited, synopsis]);

    function handleSynopsisEdit(inputArray) {
        setEdited(true);
        setSynopsis({
            contentType: "Synopsis",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}Synopsis`);
        localStorage.removeItem(`${id}Edited-Synopsis`);
        localStorage.removeItem(`${id}SynopsisGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleSynopsisSubmit() {
        setProgress(50);
        await replaceImage(synopsis, "CharacterInfo", "Synopsis", id);
        await updateData(path, "Synopsis", synopsis);
        setProgress(75);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setUploading(true);
        setProgress(25);
        const time = Date().toLocaleString();
        let array = await getData("/ContentRef", id);
        const updatedAt = { updatedAt: time, updatedBy: email };
        array = { ...array, timeStampArray: arrayUnion(updatedAt) };
        try {
            await updateData("/ContentRef", id, array);
            await handleSynopsisSubmit();
        } catch (e) {
            console.log(e);
        }
        setProgress(100);
        setUploading(false);
        setTimeout(() => {
            handleClearStorage();
            setProgress(0);
            router(0);
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
                <h1>Edit {replacePartOfAString(id, ",", " ")} Synopsis</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <ContentForm
                            handleFormContents={handleSynopsisEdit}
                            isManualOfStyle={false}
                            section={"Synopsis"}
                            reset={confirm}
                            edited={`${id}Edited-Synopsis`}
                            path={path}
                            contentName={id}
                        />
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
            <Link to={`/Character/${id}/Synopsis`}>Back</Link>
        </div>
    );
}

export default EditCharacterSynopsis;
