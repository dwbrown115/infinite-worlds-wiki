import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function FactionPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Factions";
    const router = useNavigate();

    const [faction, setFaction] = useState("");
    const [series, setSeries] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [history, setHistory] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${faction.split(" ")}/`;

    useEffect(() => {
        const storedFaction = localStorage.getItem("faction");
        if (storedFaction) {
            setFaction(storedFaction);
        } else if (!storedFaction) {
            // console.log("No faction");
        }

        const storedSeries = localStorage.getItem("series-faction");
        if (storedSeries) {
            setSeries(storedSeries);
        } else if (!storedSeries) {
            // console.log("No series");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("faction", faction);
        localStorage.setItem("series-faction", series);
        localStorage.setItem(
            "factionManualOfStyle",
            JSON.stringify(manualOfStyle)
        );
        localStorage.setItem("factionBlurb", JSON.stringify(blurb));
        localStorage.setItem("factionHistory", JSON.stringify(history));
        localStorage.setItem("factionObjectives", JSON.stringify(objectives));
        localStorage.setItem("factionMembers", JSON.stringify(members));
    }, [faction, manualOfStyle, blurb, history, objectives, members]);

    function handleResetConfirm() {
        if (reset == true) {
            setConfirm(true);
            setFaction("");
            setSeries("");
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

    function handleManualOfStyle(inputArray) {
        setManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleHistory(inputArray) {
        setHistory({
            contentType: "History",
            content: inputArray,
        });
    }

    function handleObjectives(inputArray) {
        setObjectives({
            contentType: "Objectives",
            content: inputArray,
        });
    }

    function handleMembers(inputArray) {
        setMembers({
            contentType: "Members",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        await replaceImage(
            manualOfStyle,
            "FactionInfo",
            "ManualOfStyle",
            `${faction.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
        setProgress(0);
    }

    async function handleBlurbSubmit() {
        await replaceImage(blurb, "FactionInfo", "Blurb");
        await addData(path, "Blurb", blurb);
        setProgress(20);
    }

    async function handleHistorySubmit() {
        await replaceImage(history, "FactionInfo", "History");
        await addData(path, "History", history);
        setProgress(40);
    }

    async function handleObjectivesSubmit() {
        await replaceImage(objectives, "FactionInfo", "Objectives");
        await addData(path, "Objectives", objectives);
        setProgress(60);
    }

    async function handleMembersSubmit() {
        await replaceImage(members, "FactionInfo", "Members");
        await addData(path, "Members", members);
        setProgress(80);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: faction,
            Series: series,
            Type: "Faction",
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "ContentRef", `${faction.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "ContentRef", `${faction.split(" ")}`),
                data
            ).then(async () => {
                await handleManualOfStyleSubmit();
                await handleBlurbSubmit();
                await handleHistorySubmit();
                await handleObjectivesSubmit();
                await handleMembersSubmit();
                await setFaction("");
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
            <hr />
            <form onSubmit={handleSubmit}>
                <h1>Faction Page Template</h1>
                <div>
                    <h3>Faction Name</h3>
                    <input
                        type="text"
                        placeholder="Faction name:"
                        value={faction}
                        onChange={(e) => setFaction(e.target.value)}
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
                <hr />
                <div>
                    <div>
                        <h2>Faction Manual of Style</h2>
                        <ContentForm
                            handleFormContents={handleManualOfStyle}
                            isManualOfStyle={true}
                            section={"factionManualOfStyle"}
                            reset={confirm}
                        />
                    </div>
                    <hr />
                    <div>
                        <h2>Faction Blurb</h2>
                        <ContentForm
                            handleFormContents={handleBlurb}
                            isManualOfStyle={false}
                            section={"factionBlurb"}
                            reset={confirm}
                        />
                    </div>
                </div>
                <hr />
                <div>
                    <div>
                        <h2>Faction History</h2>
                        <ContentForm
                            handleFormContents={handleHistory}
                            isManualOfStyle={false}
                            section={"factionHistory"}
                            reset={confirm}
                        />
                    </div>
                    <hr />
                    <div>
                        <h2>Faction Objectives</h2>
                        <ContentForm
                            handleFormContents={handleObjectives}
                            isManualOfStyle={false}
                            section={"factionObjectives"}
                            reset={confirm}
                        />
                    </div>
                    <hr />
                    <div>
                        <h2>Faction Members</h2>
                        <ContentForm
                            handleFormContents={handleMembers}
                            isManualOfStyle={true}
                            section={"factionMembers"}
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
            <Link to="/user/upload">Back</Link>
        </>
    );
}

export default FactionPageTemplate;
