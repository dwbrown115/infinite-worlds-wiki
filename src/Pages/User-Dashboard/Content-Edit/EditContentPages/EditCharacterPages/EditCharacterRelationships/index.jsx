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

function EditCharacterRelationships() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditCharacterRelationships/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [relationships, setRelationships] = useState([]);
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
                window.location.href.split("EditCharacterRelationships/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(relationships, id, "Relationships");
    }, [edited, relationships]);

    function handleRelationshipEdit(inputArray) {
        setEdited(true);
        setRelationships({
            contentType: "Relationship",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}Relationships`);
        localStorage.removeItem(`${id}Edited-Relationships`);
        localStorage.removeItem(`${id}RelationshipsGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleRelationshipSubmit() {
        setProgress(50);
        await replaceImage(relationships, "CharacterInfo", "Relationships", id);
        await updateData(path, "Relationships", relationships);
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
            await handleRelationshipSubmit();
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
                <hr />
                <h1>Edit {replacePartOfAString(id, ",", " ")} Relationships</h1>
                <form onSubmit={handleSubmit}>
                    <hr />
                    <div>
                        <ContentForm
                            handleFormContents={handleRelationshipEdit}
                            isManualOfStyle={false}
                            section={"Relationships"}
                            reset={confirm}
                            edited={`${id}Edited-Relationships`}
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
            <Link to={`/Character/${id}/Relationships`}>Back</Link>
        </>
    );
}

export default EditCharacterRelationships;
