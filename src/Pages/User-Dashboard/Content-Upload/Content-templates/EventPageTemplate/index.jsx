import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function EventPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/ContentType/Events";
    const router = useNavigate();

    const [event, setEvent] = useState("");
    const [eventManualOfStyle, setEventManualOfStyle] = useState([]);
    const [eventBlurb, seteventBlurb] = useState([]);
    const [eventSynopsis, setEventSynopsis] = useState([]);
    const [impact, setImpact] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${event.split(" ")}/EventInfo/`;

    useEffect(() => {
        const storedEvent = localStorage.getItem("event");
        if (storedEvent != null) {
            setEvent(storedEvent);
        } else if (!storedEvent) {
            // console.log("No event");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("event", event);
        localStorage.setItem(
            "eventManualOfStyle",
            JSON.stringify(eventManualOfStyle)
        );
        localStorage.setItem("eventBlurb", JSON.stringify(eventBlurb));
        localStorage.setItem("eventSynopsis", JSON.stringify(eventSynopsis));
        localStorage.setItem("impact", JSON.stringify(impact));
    }, [event, eventManualOfStyle, eventBlurb, eventSynopsis, impact]);

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

    function handleeventManualOfStyle(inputArray) {
        setEventManualOfStyle({
            contentType: "EventeventManualOfStyle",
            content: inputArray,
        });
    }

    function handleeventBlurb(inputArray) {
        seteventBlurb({
            contentType: "EventeventBlurb",
            content: inputArray,
        });
    }

    function handleeventSynopsis(inputArray) {
        setEventSynopsis({
            contentType: "EventeventSynopsis",
            content: inputArray,
        });
    }

    function handleImpact(inputArray) {
        setImpact({
            contentType: "EventImpact",
            content: inputArray,
        });
    }

    async function handleeventManualOfStyleSubmit() {
        await replaceImage(
            eventManualOfStyle,
            "EventInfo",
            "eventManualOfStyle",
            `${event.split(" ")}`
        );
        await addData(path, "eventManualOfStyle", eventManualOfStyle);
    }

    async function handleeventBlurbSubmit() {
        await replaceImage(
            eventBlurb,
            "EventInfo",
            "eventBlurb",
            `${event.split(" ")}`
        );
        await addData(path, "eventBlurb", eventBlurb);
    }

    async function handleeventSynopsisSubmit() {
        await replaceImage(
            eventSynopsis,
            "EventInfo",
            "eventSynopsis",
            `${event.split(" ")}`
        );
        await addData(path, "eventSynopsis", eventSynopsis);
    }

    async function handleImpactSubmit() {
        await replaceImage(
            impact,
            "EventInfo",
            "eventManualOfStyle",
            `${event.split(" ")}`
        );
        await addData(path, "eventManualOfStyle", impact);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            Name: event,
            createdAt: time,
            createdBy: email,
        };
        const docRef = doc(db, "ContentRef", `${event.split(" ")}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return alert("This event already exists!");
        } else {
            await setDoc(doc(db, "ContentRef", `${event.split(" ")}`), data)
                .then(async () => {
                    await handleeventManualOfStyleSubmit();
                    await handleeventBlurbSubmit();
                    await handleeventSynopsisSubmit();
                    await handleImpactSubmit();
                    await handleResetConfirm();
                    setEvent("");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <>
            <div>
                <hr />
                <form onSubmit={handleUpload}>
                    <h1>Event Page Template</h1>
                    <div>
                        <h2>Event Name</h2>
                        <input
                            type="text"
                            placeholder="Event name:"
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                            required
                        />
                    </div>
                    <hr />
                    <div>
                        <div>
                            <div>
                                <h2>Event Manual Of Style</h2>
                                <ContentForm
                                    handleFormContents={
                                        handleeventManualOfStyle
                                    }
                                    isManualOfStyle={true}
                                    section={"eventManualOfStyle"}
                                    reset={confirm}
                                />
                            </div>
                            <hr />
                            <div>
                                <h2>Event Blurb</h2>
                                <ContentForm
                                    handleFormContents={handleeventBlurb}
                                    isManualOfStyle={false}
                                    section={"eventBlurb"}
                                    reset={confirm}
                                />
                            </div>
                        </div>
                        <hr />
                        <div>
                            <h2>Event Synopsis</h2>
                            <ContentForm
                                handleFormContents={handleeventSynopsis}
                                isManualOfStyle={false}
                                section={"eventSynopsis"}
                                reset={confirm}
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
                            />
                        </div>
                    </div>
                </form>
                <hr />
                <br />
                {reset === false ? (
                    <button
                        onClick={() => {
                            setReset(true);
                        }}
                    >
                        Reset All
                    </button>
                ) : (
                    <div />
                )}
                {reset === true ? (
                    <div>
                        <button onClick={() => setReset(false)}>
                            Cancel reset
                        </button>
                        <button onClick={handleResetConfirm}>
                            Confirm reset
                        </button>
                    </div>
                ) : (
                    <div />
                )}
                <br />
                <Link to={"/user/upload"}>Go Back</Link>
            </div>
        </>
    );
}

export default EventPageTemplate;
