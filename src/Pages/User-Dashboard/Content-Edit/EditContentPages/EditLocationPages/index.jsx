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

function EditLocationPage() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditLocationPage/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [geographyAndEcology, setGeographyAndEcology] = useState([]);
    const [history, setHistory] = useState([]);
    const [culture, setCulture] = useState([]);
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [edited, setEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `/Content/Locations/${id}`;

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
                window.location.href.split("EditLocationPage/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useLayoutEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        handleCheckEmptyArray(manualOfStyle, id, "ManualOfStyle");
        handleCheckEmptyArray(blurb, id, "Blurb");
        handleCheckEmptyArray(geographyAndEcology, id, "GeographyAndEcology");
        handleCheckEmptyArray(history, id, "History");
        handleCheckEmptyArray(culture, id, "Culture");
    }, [edited, manualOfStyle, blurb, geographyAndEcology, history, culture]);

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

    function handleGeographyAndEcologyEdit(inputArray) {
        setEdited(true);
        setGeographyAndEcology({
            contentType: "GeographyAndEcology",
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

    function handleCultureEdit(inputArray) {
        setEdited(true);
        setCulture({
            contentType: "Culture",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}ManualOfStyle`);
        localStorage.removeItem(`${id}Blurb`);
        localStorage.removeItem(`${id}GeographyAndEcology`);
        localStorage.removeItem(`${id}History`);
        localStorage.removeItem(`${id}Culture`);
        localStorage.removeItem(`${id}Edited`);
        localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
        localStorage.removeItem(`${id}BlurbGrabbed`);
        localStorage.removeItem(`${id}GeographyAndEcologyGrabbed`);
        localStorage.removeItem(`${id}HistoryGrabbed`);
        localStorage.removeItem(`${id}CultureGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleManualOfStyleSubmit() {
        setProgress(10);
        await replaceImage(manualOfStyle, "LocationInfo", "ManualOfStyle", id);
        await updateData(path, "ManualOfStyle", manualOfStyle);
        setProgress(20);
    }

    async function handleBlurbSubmit() {
        setProgress(30);
        await replaceImage(blurb, "LocationInfo", "Blurb", id);
        await updateData(path, "Blurb", blurb);
        setProgress(40);
    }

    async function handleGeographyAndEcologySubmit() {
        setProgress(50);
        await replaceImage(
            geographyAndEcology,
            "LocationInfo",
            "GeographyAndEcology",
            id
        );
        await updateData(path, "GeographyAndEcology", geographyAndEcology);
        setProgress(60);
    }

    async function handleHistorySubmit() {
        setProgress(70);
        await replaceImage(history, "LocationInfo", "History", id);
        await updateData(path, "History", history);
        setProgress(80);
    }

    async function handleCultureSubmit() {
        setProgress(90);
        await replaceImage(culture, "LocationInfo", "Culture", id);
        await updateData(path, "Culture", culture);
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
            await handleGeographyAndEcologySubmit();
            await handleHistorySubmit();
            await handleCultureSubmit();
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
                            <h2>Edit Geography and Ecology</h2>
                            <ContentForm
                                handleFormContents={
                                    handleGeographyAndEcologyEdit
                                }
                                isManualOfStyle={false}
                                section={"GeographyAndEcology"}
                                reset={confirm}
                                edited={`${id}Edited`}
                                path={path}
                                contentName={id}
                            />
                        </div>
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
            <Link to={`/Location/${id}`}>Back</Link>
        </>
    );
}

export default EditLocationPage;
