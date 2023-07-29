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

    const [race, setRace] = useState("");
    const [raceManualOfStyle, setRaceManualOfStyle] = useState([]);
    const [raceBlurb, setRaceBlurb] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
    const [culture, setCulture] = useState([]);
    const [raceHistory, setRaceHistory] = useState([]);
    const [notableMembers, setNotableMembers] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${race.split(" ")}/RaceInfo/`;

    useEffect(() => {
        const storedRace = localStorage.getItem("race");
        if (storedRace) {
            setrace(storedRace);
        } else if (!storedRace) {
            // console.log("No race");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("race", race);
        localStorage.setItem("raceManualOfStyle", JSON.stringify(raceManualOfStyle));
        localStorage.setItem("raceBlurb", JSON.stringify(raceBlurb));
        localStorage.setItem("characteristics", JSON.stringify(characteristics));
        localStorage.setItem("culture", JSON.stringify(culture));
        localStorage.setItem("raceHistory", JSON.stringify(raceHistory));
        localStorage.setItem("notableMembers", JSON.stringify(notableMembers));
    }, [race, raceManualOfStyle, raceBlurb, characteristics, culture, raceHistory, notableMembers]);

    function handleResetConfirm() {
        if (reset == true) {
            setConfirm(true);
            setTimeout(() => {
                setReset(false);
                setConfirm(false);
            }, 10);
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
                router("/login");
            }
        });
    }, [user]);

    function handleraceManualOfStyle(inputArray) {
        setRaceManualOfStyle({
            contentType: "RaceraceManualOfStyle",
            content: inputArray,
        });
    }

    function handleraceBlurb(inputArray) {
        setRaceBlurb({
            contentType: "RaceraceBlurb",
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

    function handleraceHistory(inputArray) {
        setRaceHistory({
            contentType: "RaceraceHistory",
            content: inputArray,
        });
    }

    function handleNotableMembers(inputArray) {
        setNotableMembers({
            contentType: "RaceNotableMembers",
            content: inputArray,
        });
    }

    async function handleraceManualOfStyleSubmit() {
        await replaceImage(
            raceManualOfStyle,
            "RaceInfo",
            "raceManualOfStyle",
            `${race.split(" ")}`
        );
        await addData(path, "raceManualOfStyle", raceManualOfStyle);
    }

    async function handleraceBlurbSubmit() {
        await replaceImage(raceBlurb, "RaceInfo", "raceBlurb", `${race.split(" ")}`);
        await addData(path, "raceBlurb", raceBlurb);
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

    async function handleraceHistorySubmit() {
        await replaceImage(
            raceHistory,
            "RaceInfo",
            "raceHistory",
            `${race.split(" ")}`
        );
        await addData(path, "raceHistory", raceHistory);
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
                await handleraceManualOfStyleSubmit();
                await handleraceBlurbSubmit();
                await handleCharacteristicsSubmit();
                await handleCultureSubmit();
                await handleraceHistorySubmit();
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
                                handleFormContents={handleraceManualOfStyle}
                                isManualOfStyle={true}
                                section={"raceManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>raceBlurb</h2>
                            <ContentForm
                                handleFormContents={handleraceBlurb}
                                isManualOfStyle={false}
                                section={"raceBlurb"}
                                reset={confirm}
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
                                section={"characteristics"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race Culture</h2>
                            <ContentForm
                                handleFormContents={handleCulture}
                                isManualOfStyle={false}
                                section={"culture"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race raceHistory</h2>
                            <ContentForm
                                handleFormContents={handleraceHistory}
                                isManualOfStyle={false}
                                section={"raceHistory"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race Notable Members</h2>
                            <ContentForm
                                handleFormContents={handleNotableMembers}
                                isManualOfStyle={false}
                                section={"notableMembers"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                    <hr />
                    <button type="submit">Submit</button>
                </form>
                <br />
                <button
                    onClick={() => {
                        setReset(true);
                    }}
                >
                    Reset All
                </button>
                {reset === true ? (
                    <button onClick={handleResetConfirm}>Confirm reset</button>
                ) : (
                    <div />
                )}
                <br />
                <Link to={"/user/upload"}>Go Back</Link>
            </div>
        </>
    );
}

export default RacePageTemplate;
