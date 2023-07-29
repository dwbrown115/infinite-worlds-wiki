import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function RacePageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/ContentType/Race";
    const router = useNavigate();

    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
    const [culture, setCulture] = useState([]);
    const [history, setHistory] = useState([]);
    const [notableMembers, setNotableMembers] = useState([]);
    const [race, setRace] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${race.split(" ")}/RaceInfo/`;

    useEffect(() => {
        // console.log(reset)
        setReset(true);
    }, [reset]);

    function handleResetConfirm() {
        setConfirm(false);
        if (reset == false) {
            setReset(true);
        } else {
            setReset(false);
        }
    }

    async function grabUser() {
        const collection = "users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            setEmail(data["email"]);
            // setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
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
                router("/user/login");
            }
        });
    }, [user]);

    function handleManualOfStyle(inputArray) {
        setManualOfStyle({
            contentType: "RaceManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "RaceBlurb",
            content: inputArray,
        });
    }

    function handleCharacteristics(inputArray) {
        setCharacteristics({
            contentType: "RaceCharacteristics",
            content: inputArray,
        });
    }

    function handleCulture(inputArray) {
        setCulture({
            contentType: "RaceCulture",
            content: inputArray,
        });
    }

    function handleHistory(inputArray) {
        setHistory({
            contentType: "RaceHistory",
            content: inputArray,
        });
    }

    function handleNotableMembers(inputArray) {
        setNotableMembers({
            contentType: "RaceNotableMembers",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        await replaceImage(
            manualOfStyle,
            "RaceInfo",
            "ManualOfStyle",
            `${race.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
    }

    async function handleBlurbSubmit() {
        await replaceImage(blurb, "RaceInfo", "Blurb", `${race.split(" ")}`);
        await addData(path, "Blurb", blurb);
    }

    async function handleCharacteristicsSubmit() {
        await replaceImage(
            characteristics,
            "RaceInfo",
            "Characteristics",
            `${race.split(" ")}`
        );
        await addData(path, "Characteristics", characteristics);
    }

    async function handleCultureSubmit() {
        await replaceImage(
            culture,
            "RaceInfo",
            "Culture",
            `${race.split(" ")}`
        );
        await addData(path, "Culture", culture);
    }

    async function handleHistorySubmit() {
        await replaceImage(
            history,
            "RaceInfo",
            "History",
            `${race.split(" ")}`
        );
        await addData(path, "History", history);
    }

    async function handleNotableMembersSubmit() {
        await replaceImage(
            notableMembers,
            "RaceInfo",
            "NotableMembers",
            `${race.split(" ")}`
        );
        await addData(path, "NotableMembers", notableMembers);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            RaceName: race,
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "races", `${race.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "Characters", `${race.split(" ")}`),
                data
            ).then(async () => {
                await handleManualOfStyleSubmit();
                await handleBlurbSubmit();
                await handleCharacteristicsSubmit();
                await handleCultureSubmit();
                await handleHistorySubmit();
                await handleNotableMembersSubmit();
                await handleResetConfirm();
                await setRace("");
            });
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleUpload}>
                    <h1>Race Page Template</h1>
                    <div>
                        <h2>Race name</h2>
                        <input
                            type="text"
                            placeholder="Race name:"
                            value={race}
                            onChange={(e) => setRace(e.target.value)}
                        />
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Manual of Style</h2>
                            <ContentForm
                                handleFormContents={handleManualOfStyle}
                                isManualOfStyle={true}
                                section={manualOfStyle}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Blurb</h2>
                            <ContentForm
                                handleFormContents={handleBlurb}
                                isManualOfStyle={false}
                                section={blurb}
                                reset={reset}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Race Characteristics</h2>
                            <ContentForm
                                handleFormContents={handleCharacteristics}
                                isManualOfStyle={false}
                                section={characteristics}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race Culture</h2>
                            <ContentForm
                                handleFormContents={handleCulture}
                                isManualOfStyle={false}
                                section={culture}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race History</h2>
                            <ContentForm
                                handleFormContents={handleHistory}
                                isManualOfStyle={false}
                                section={history}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race Notable Members</h2>
                            <ContentForm
                                handleFormContents={handleNotableMembers}
                                isManualOfStyle={false}
                                section={notableMembers}
                                reset={reset}
                            />
                        </div>
                    </div>
                    <hr />
                    <button type="submit">Submit</button>
                </form>
                <br />
                <button
                    onClick={() => {
                        setConfirm(true);
                    }}
                >
                    Reset
                </button>
                {confirm === true ? (
                    <button onClick={handleResetConfirm}>Confirm reset</button>
                ) : (
                    <div />
                )}
                <Link to={"/user/upload"}>Go Back</Link>
            </div>
        </>
    );
}

export default RacePageTemplate;
