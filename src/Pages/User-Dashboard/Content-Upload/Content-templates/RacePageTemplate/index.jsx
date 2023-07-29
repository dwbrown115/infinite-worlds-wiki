import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function RacePageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Race";
    const router = useNavigate();

    const [race, setRace] = useState("");
    const [series, setSeries] = useState("");
    const [raceManualOfStyle, setRaceManualOfStyle] = useState([]);
    const [raceBlurb, setRaceBlurb] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
    const [culture, setCulture] = useState([]);
    const [raceHistory, setRaceHistory] = useState([]);
    const [notableMembers, setNotableMembers] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${race.split(" ")}/`;

    useEffect(() => {
        const storedRace = localStorage.getItem("race");
        if (storedRace) {
            setrace(storedRace);
        } else if (!storedRace) {
            // console.log("No race");
        }

        const storedSeries = localStorage.getItem("series-race");
        if (storedSeries) {
            setSeries(storedSeries);
        } else if (!storedSeries) {
            // console.log("No series");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("race", race);
        localStorage.setItem("series-rac3", series);
        localStorage.setItem(
            "raceManualOfStyle",
            JSON.stringify(raceManualOfStyle)
        );
        localStorage.setItem("raceBlurb", JSON.stringify(raceBlurb));
        localStorage.setItem(
            "characteristics",
            JSON.stringify(characteristics)
        );
        localStorage.setItem("culture", JSON.stringify(culture));
        localStorage.setItem("raceHistory", JSON.stringify(raceHistory));
        localStorage.setItem("notableMembers", JSON.stringify(notableMembers));
    }, [
        race,
        raceManualOfStyle,
        raceBlurb,
        characteristics,
        culture,
        raceHistory,
        notableMembers,
    ]);

    function handleResetConfirm() {
        if (reset == true) {
            setConfirm(true);
            setRace("");
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

    function handleRaceManualOfStyle(inputArray) {
        setRaceManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleRaceBlurb(inputArray) {
        setRaceBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleCharacteristics(inputArray) {
        setCharacteristics({
            contentType: "Characteristics",
            content: inputArray,
        });
    }

    function handleCulture(inputArray) {
        setCulture({
            contentType: "Culture",
            content: inputArray,
        });
    }

    function handleRaceHistory(inputArray) {
        setRaceHistory({
            contentType: "History",
            content: inputArray,
        });
    }

    function handleNotableMembers(inputArray) {
        setNotableMembers({
            contentType: "NotableMembers",
            content: inputArray,
        });
    }

    async function handleRaceManualOfStyleSubmit() {
        setProgress(8.333);
        await replaceImage(
            raceManualOfStyle,
            "RaceInfo",
            "ManualOfStyle",
            `${race.split(" ")}`
        );
        await addData(path, "ManualOfStyle", raceManualOfStyle);
        setProgress(16.666);
    }

    async function handleRaceBlurbSubmit() {
        setProgress(24.999);
        await replaceImage(
            raceBlurb,
            "RaceInfo",
            "Blurb",
            `${race.split(" ")}`
        );
        await addData(path, "Blurb", raceBlurb);
        setProgress(33.332);
    }

    async function handleCharacteristicsSubmit() {
        setProgress(41.665);
        await replaceImage(
            characteristics,
            "RaceInfo",
            "Characteristics",
            `${race.split(" ")}`
        );
        await addData(path, "Characteristics", characteristics);
        setProgress(49.998);
    }

    async function handleCultureSubmit() {
        setProgress(58.331);
        await replaceImage(
            culture,
            "RaceInfo",
            "Culture",
            `${race.split(" ")}`
        );
        await addData(path, "Culture", culture);
        setProgress(66.664);
    }

    async function handleRaceHistorySubmit() {
        setProgress(74.997);
        await replaceImage(
            raceHistory,
            "RaceInfo",
            "History",
            `${race.split(" ")}`
        );
        await addData(path, "History", raceHistory);
        setProgress(83.33);
    }

    async function handleNotableMembersSubmit() {
        setProgress(91.663);
        await replaceImage(
            notableMembers,
            "RaceInfo",
            "NotableMembers",
            `${race.split(" ")}`
        );
        await addData(path, "NotableMembers", notableMembers);
        setProgress(99.996);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: race,
            Series: series,
            Type: "Race",
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "ContentRef", `${race.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "ContentRef", `${race.split(" ")}`),
                data
            ).then(async () => {
                await handleRaceManualOfStyleSubmit();
                await handleRaceBlurbSubmit();
                await handleCharacteristicsSubmit();
                await handleCultureSubmit();
                await handleRaceHistorySubmit();
                await handleNotableMembersSubmit();
                await setRace("");
                await setSeries("");
                setConfirm(true);
                setTimeout(() => {
                    setConfirm(false);
                }, 1);
            });
        }
        setProgress(100);
        setLoading(false);
        setTimeout(() => {
            setProgress(0);
        }, 100);
    }

    return (
        <>
            <div>
                <hr />
                <form onSubmit={handleUpload}>
                    <h1>Race Page Template</h1>
                    <div>
                        <h3>Race Name</h3>
                        <input
                            type="text"
                            placeholder="Race name:"
                            value={race}
                            onChange={(e) => setRace(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <h3>Series</h3>
                        <input
                            type="text"
                            placeholder="Series:"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    <hr />
                    <div>
                        <div>
                            <h2>Race Manual of Style</h2>
                            <ContentForm
                                handleFormContents={handleRaceManualOfStyle}
                                isManualOfStyle={true}
                                section={"raceManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Race Blurb</h2>
                            <ContentForm
                                handleFormContents={handleRaceBlurb}
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
                            <h2>Race History</h2>
                            <ContentForm
                                handleFormContents={handleRaceHistory}
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
                    {loading ? null : <button type="submit">Submit</button>}
                </form>
                <br />
                {loading ? (
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
                <Link to={"/user/upload"}>Go Back</Link>
            </div>
        </>
    );
}

export default RacePageTemplate;

//  <div>
//      <button onClick={setReset(false)}>Cancel reset</button>
//      <button onClick={handleResetConfirm}>Confirm reset</button>
//  <div/>;
