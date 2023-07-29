import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function LocationPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/ContentType/Locations";
    const router = useNavigate();

    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [geographyAndEcology, setGeographyAndEcology] = useState([]);
    const [history, setHistory] = useState([]);
    const [culture, setCulture] = useState([]);
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${location.split(" ")}/LocationInfo/`;

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
            contentType: "LocationManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "LocationBlurb",
            content: inputArray,
        });
    }

    function handleGeographyAndEcology(inputArray) {
        setGeographyAndEcology({
            contentType: "LocationGeographyAndEcology",
            content: inputArray,
        });
    }

    function handleHistory(inputArray) {
        setHistory({
            contentType: "LocationHistory",
            content: inputArray,
        });
    }

    function handleCulture(inputArray) {
        setCulture({
            contentType: "LocationCulture",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        await replaceImage(
            manualOfStyle,
            "ItemInfo",
            "ManualOfStyle",
            `${location.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
    }

    async function handleBlurbSubmit() {
        await replaceImage(
            blurb,
            "ItemInfo",
            "Blurb",
            `${location.split(" ")}`
        );
        await addData(path, "Blurb", blurb);
    }

    async function handleGeographyAndEcologySubmit() {
        await replaceImage(
            geographyAndEcology,
            "ItemInfo",
            "GeographyAndEcology",
            `${location.split(" ")}`
        );
        await addData(path, "GeographyAndEcology", geographyAndEcology);
    }

    async function handleHistorySubmit() {
        await replaceImage(
            history,
            "ItemInfo",
            "History",
            `${location.split(" ")}`
        );
        await addData(path, "History", history);
    }

    async function handleCultureSubmit() {
        await replaceImage(
            culture,
            "ItemInfo",
            "Culture",
            `${location.split(" ")}`
        );
        await addData(path, "Culture", culture);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            LocationName: location,
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "Items", `${location.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "Characters", `${location.split(" ")}`),
                data
            ).then(async () => {
                await handleManualOfStyleSubmit();
                await handleBlurbSubmit();
                await handleGeographyAndEcologySubmit();
                await handleHistorySubmit();
                await handleCultureSubmit();
                await handleResetConfirm();
                await setLocation("");
            });
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleUpload}>
                    <h1>Location Page Template</h1>
                    <div>
                        <h2>Location name</h2>
                        <input
                            type="text"
                            placeholder="Location name:"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
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
                    <div>
                        <div>
                            <h2>Location Geography And Ecology</h2>
                            <ContentForm
                                handleFormContents={handleGeographyAndEcology}
                                isManualOfStyle={false}
                                section={geographyAndEcology}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location History</h2>
                            <ContentForm
                                handleFormContents={handleCulture}
                                isManualOfStyle={false}
                                section={history}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location Culture</h2>
                            <ContentForm
                                handleFormContents={handleHistory}
                                isManualOfStyle={false}
                                section={culture}
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

export default LocationPageTemplate;
