import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function EventPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Events";
    const router = useNavigate();

    const [event, setEvent] = useState("");
    const [series, setSeries] = useState("");
    const [eventManualOfStyle, setEventManualOfStyle] = useState([]);
    const [eventBlurb, seteventBlurb] = useState([]);
    const [eventSynopsis, setEventSynopsis] = useState([]);
    const [impact, setImpact] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${event.split(" ")}/`;

    useEffect(() => {
        const storedEvent = localStorage.getItem("event");
        if (storedEvent != null) {
            setEvent(storedEvent);
        } else if (!storedEvent) {
            // console.log("No event");
        }

        const storedSeries = localStorage.getItem("series-event");
        if (storedSeries) {
            setSeries(storedSeries);
        } else if (!storedSeries) {
            // console.log("No series");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("event", event);
        localStorage.setItem("series-event", series);
        localStorage.setItem(
            "eventManualOfStyle",
            JSON.stringify(eventManualOfStyle)
        );
        localStorage.setItem("eventBlurb", JSON.stringify(eventBlurb));
        localStorage.setItem("eventSynopsis", JSON.stringify(eventSynopsis));
        localStorage.setItem("impact", JSON.stringify(impact));
        localStorage.setItem("edited-event", edited);
    }, [
        event,
        series,
        eventManualOfStyle,
        eventBlurb,
        eventSynopsis,
        impact,
        edited,
    ]);

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setEvent("");
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
        document.title = "Event Page Template || Infinite Worlds Wiki";
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

    function handleEventManualOfStyle(inputArray) {
        setEdited(true);
        setEventManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleEventBlurb(inputArray) {
        setEdited(true);
        seteventBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleEventSynopsis(inputArray) {
        setEdited(true);
        setEventSynopsis({
            contentType: "Synopsis",
            content: inputArray,
        });
    }

    function handleImpact(inputArray) {
        setEdited(true);
        setImpact({
            contentType: "Impact",
            content: inputArray,
        });
    }

    async function handleEventManualOfStyleSubmit() {
        await replaceImage(
            eventManualOfStyle,
            "EventInfo",
            "ManualOfStyle",
            `${event.split(" ")}`
        );
        await addData(path, "ManualOfStyle", eventManualOfStyle);
        setProgress(10);
    }

    async function handleEventBlurbSubmit() {
        setProgress(20);
        await replaceImage(
            eventBlurb,
            "EventInfo",
            "Blurb",
            `${event.split(" ")}`
        );
        await addData(path, "Blurb", eventBlurb);
        setProgress(30);
    }

    async function handleEventSynopsisSubmit() {
        setProgress(40);
        await replaceImage(
            eventSynopsis,
            "EventInfo",
            "Synopsis",
            `${event.split(" ")}`
        );
        await addData(path, "Synopsis", eventSynopsis);
        setProgress(50);
    }

    async function handleImpactSubmit() {
        setProgress(60);
        await replaceImage(
            impact,
            "EventInfo",
            "Impact",
            `${event.split(" ")}`
        );
        await addData(path, "Impact", impact);
        setProgress(70);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: event,
            Series: series,
            Type: "Event",
            createdAt: time,
            createdBy: email,
        };
        const docRef = doc(db, "ContentRef", `${event.split(" ")}`);
        const docSnap = await getDoc(docRef);

        setProgress(80);
        if (docSnap.exists()) {
            return alert("This event already exists!");
        } else {
            await setDoc(doc(db, "ContentRef", `${event.split(" ")}`), data)
                .then(async () => {
                    await handleEventManualOfStyleSubmit();
                    await handleEventBlurbSubmit();
                    await handleEventSynopsisSubmit();
                    await handleImpactSubmit();
                    await setEvent("");
                    await setSeries("");
                    setConfirm(true);
                    setTimeout(() => {
                        setConfirm(false);
                    }, 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setEdited(false);
        setProgress(100);
        setLoading(false);
        setTimeout(() => {
            setProgress(0);
        }, 100);
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <div>
                <form onSubmit={handleUpload}>
                    <h1>Event Page Template</h1>
                    <div>
                        <h3>Event Name</h3>
                        <input
                            type="text"
                            placeholder="Event name:"
                            value={event}
                            onChange={(e) => {
                                setEvent(e.target.value);
                                setEdited(true);
                            }}
                            required
                        />
                    </div>
                    <div>
                        <h3>Series</h3>
                        <input
                            type="text"
                            placeholder="Series:"
                            value={series}
                            onChange={(e) => {
                                setSeries(e.target.value);
                                setEdited(true);
                            }}
                            required
                        />
                    </div>
                    <br />
                    <hr />
                    <div>
                        <div>
                            <div>
                                <h2>Event Manual Of Style</h2>
                                <ContentForm
                                    handleFormContents={
                                        handleEventManualOfStyle
                                    }
                                    isManualOfStyle={true}
                                    section={"eventManualOfStyle"}
                                    reset={confirm}
                                    edited={"edited-event"}
                                />
                            </div>
                            <hr />
                            <div>
                                <h2>Event Blurb</h2>
                                <ContentForm
                                    handleFormContents={handleEventBlurb}
                                    isManualOfStyle={false}
                                    section={"eventBlurb"}
                                    reset={confirm}
                                    edited={"edited-event"}
                                />
                            </div>
                        </div>
                        <hr />
                        <div>
                            <h2>Event Synopsis</h2>
                            <ContentForm
                                handleFormContents={handleEventSynopsis}
                                isManualOfStyle={false}
                                section={"eventSynopsis"}
                                reset={confirm}
                                edited={"edited-event"}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Event Impact</h2>
                            <ContentForm
                                handleFormContents={handleImpact}
                                isManualOfStyle={false}
                                section={"impact"}
                                reset={confirm}
                                edited={"edited-event"}
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
                <Link to={"/user/upload"}>Go Back</Link>
            </div>
        </div>
    );
}

export default EventPageTemplate;
