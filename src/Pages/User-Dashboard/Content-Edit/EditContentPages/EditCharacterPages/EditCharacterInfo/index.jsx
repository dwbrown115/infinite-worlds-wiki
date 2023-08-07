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

function EditCharacterInfo() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditCharacterInfo/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [powersAndAbilities, setPowersAndAbilities] = useState([]);
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
                window.location.href.split("EditCharacterInfo/")[1],
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
        handleCheckEmptyArray(equipment, id, "Equipment");
        handleCheckEmptyArray(powersAndAbilities, id, "PowersAndAbilities");
    }, [edited, manualOfStyle, blurb, info, equipment, powersAndAbilities]);

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

    function handleEquipmentEdit(inputArray) {
        setEdited(true);
        setEquipment({
            contentType: "Equipment",
            content: inputArray,
        });
    }

    function handlePowersAndAbilitiesEdit(inputArray) {
        setEdited(true);
        setPowersAndAbilities({
            contentType: "PowersAndAbilities",
            content: inputArray,
        });
    }

    function handleClearStorage() {
        localStorage.removeItem(`${id}ManualOfStyle`);
        localStorage.removeItem(`${id}Blurb`);
        localStorage.removeItem(`${id}Info`);
        localStorage.removeItem(`${id}Equipment`);
        localStorage.removeItem(`${id}PowersAndAbilities`);
        localStorage.removeItem(`${id}Edited`);
        localStorage.removeItem(`${id}ManualOfStyleGrabbed`);
        localStorage.removeItem(`${id}BlurbGrabbed`);
        localStorage.removeItem(`${id}InfoGrabbed`);
        localStorage.removeItem(`${id}EquipmentGrabbed`);
        localStorage.removeItem(`${id}PowersAndAbilitiesGrabbed`);
    }

    function handleResetConfirm() {
        handleClearStorage();
        router(0);
    }

    async function handleManualOfStyleSubmit() {
        setProgress(0);
        await replaceImage(manualOfStyle, "CharacterInfo", "ManualOfStyle", id);
        await updateData(path, "ManualOfStyle", manualOfStyle);
        setProgress(10);
    }

    async function handleBlurbSubmit() {
        setProgress(20);
        await replaceImage(blurb, "CharacterInfo", "Blurb", id);
        await updateData(path, "Blurb", blurb);
        setProgress(30);
    }

    async function handleInfoSubmit() {
        setProgress(40);
        await replaceImage(info, "CharacterInfo", "Info", id);
        await updateData(path, "Info", info);
        setProgress(50);
    }

    async function handleEquipmentSubmit() {
        setProgress(60);
        await replaceImage(equipment, "CharacterInfo", "Equipment", id);
        await updateData(path, "Equipment", equipment);
        setProgress(70);
    }

    async function handlePowersAndAbilitiesSubmit() {
        setProgress(80);
        await replaceImage(
            powersAndAbilities,
            "CharacterInfo",
            "PowersAndAbilities",
            id
        );
        await updateData(path, "PowersAndAbilities", powersAndAbilities);
        setProgress(90);
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
            await handleEquipmentSubmit();
            await handlePowersAndAbilitiesSubmit();
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
                            <h2>Blurb</h2>
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
                    <hr />
                    <div>
                        <h2>Edit Equipment</h2>
                        <ContentForm
                            handleFormContents={handleEquipmentEdit}
                            isManualOfStyle={false}
                            section={"Equipment"}
                            reset={confirm}
                            edited={`${id}Edited`}
                            path={path}
                            contentName={id}
                        />
                    </div>
                    <hr />
                    <div>
                        <h2>Edit Powers and Abilities</h2>
                        <ContentForm
                            handleFormContents={handlePowersAndAbilitiesEdit}
                            isManualOfStyle={false}
                            section={"PowersAndAbilities"}
                            reset={confirm}
                            edited={`${id}Edited`}
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
            <Link to={`/Character/${id}`}>Back</Link>
        </div>
    );
}

export default EditCharacterInfo;
