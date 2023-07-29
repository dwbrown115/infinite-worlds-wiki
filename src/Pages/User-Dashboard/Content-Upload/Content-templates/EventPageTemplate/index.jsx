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

    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [impact, setImpact] = useState([]);
    const [event, setEvent] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${event.split(" ")}/EventInfo/`;

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
            contentType: "EventManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "EventBlurb",
            content: inputArray,
        });
    }

    function handleSynopsis(inputArray) {
        setSynopsis({
            contentType: "EventSynopsis",
            content: inputArray,
        });
    }

    function handleImpact(inputArray) {
        setImpact({
            contentType: "EventImpact",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        await replaceImage(
            manualOfStyle,
            "EventInfo",
            "ManualOfStyle",
            `${event.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
    }

    async function handleBlurbSubmit() {
        await replaceImage(blurb, "EventInfo", "Blurb", `${event.split(" ")}`);
        await addData(path, "Blurb", blurb);
    }

    async function handleSynopsisSubmit() {
        await replaceImage(
            synopsis,
            "EventInfo",
            "Synopsis",
            `${event.split(" ")}`
        );
        await addData(path, "Synopsis", synopsis);
    }

    async function handleImpactSubmit() {
        await replaceImage(
            impact,
            "EventInfo",
            "ManualOfStyle",
            `${event.split(" ")}`
        );
        await addData(path, "ManualOfStyle", impact);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            contentType: "Event",
            createdAt: time,
            createdBy: email,
        };
        const docRef = doc(db, "Events", `${event.split(" ")}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return alert("This event already exists!");
        } else {
            await setDoc(doc(db, "Events", `${event.split(" ")}`), data)
                .then(async () => {
                    await handleManualOfStyleSubmit();
                    await handleBlurbSubmit();
                    await handleSynopsisSubmit();
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
                        <h2>Event name</h2>
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
                                <h2>Manual Of Style</h2>
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
                            <h2>Synopsis</h2>
                            <ContentForm
                                handleFormContents={handleSynopsis}
                                isManualOfStyle={false}
                                section={synopsis}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Impact</h2>
                            <ContentForm
                                handleFormContents={handleImpact}
                                isManualOfStyle={false}
                                section={impact}
                                reset={reset}
                            />
                        </div>
                    </div>
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

export default EventPageTemplate;
