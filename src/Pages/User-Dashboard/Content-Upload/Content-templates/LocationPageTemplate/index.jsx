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

    const [location, setLocation] = useState("");
    const [locationManualOfStyle, setLocationManualOfStyle] = useState([]);
    const [locationBlurb, setLocationBlurb] = useState([]);
    const [geographyAndEcology, setGeographyAndEcology] = useState([]);
    const [locationHistory, setLocationHistory] = useState([]);
    const [culture, setCulture] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${location.split(" ")}/LocationInfo/`;

    useEffect(() => {
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            setlocation(storedLocation);
        } else if (!storedLocation) {
            // console.log("No location");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("location", location);
        localStorage.setItem(
            "locationManualOfStyle",
            JSON.stringify(locationManualOfStyle)
        );
        localStorage.setItem("locationBlurb", JSON.stringify(locationBlurb));
        localStorage.setItem(
            "geographyAndEcology",
            JSON.stringify(geographyAndEcology)
        );
        localStorage.setItem(
            "locationHistory",
            JSON.stringify(locationHistory)
        );
        localStorage.setItem("culture", JSON.stringify(culture));
    }, [
        location,
        locationManualOfStyle,
        locationBlurb,
        geographyAndEcology,
        locationHistory,
        culture,
    ]);

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

    function handlelocationManualOfStyle(inputArray) {
        setLocationManualOfStyle({
            contentType: "LocationlocationManualOfStyle",
            content: inputArray,
        });
    }

    function handlelocationBlurb(inputArray) {
        setLocationBlurb({
            contentType: "LocationlocationBlurb",
            content: inputArray,
        });
    }

    function handleGeographyAndEcology(inputArray) {
        setGeographyAndEcology({
            contentType: "LocationGeographyAndEcology",
            content: inputArray,
        });
    }

    function handlelocationHistory(inputArray) {
        setLocationHistory({
            contentType: "LocationlocationHistory",
            content: inputArray,
        });
    }

    function handleCulture(inputArray) {
        setCulture({
            contentType: "LocationCulture",
            content: inputArray,
        });
    }

    async function handlelocationManualOfStyleSubmit() {
        await replaceImage(
            locationManualOfStyle,
            "ItemInfo",
            "locationManualOfStyle",
            `${location.split(" ")}`
        );
        await addData(path, "locationManualOfStyle", locationManualOfStyle);
    }

    async function handlelocationBlurbSubmit() {
        await replaceImage(
            locationBlurb,
            "ItemInfo",
            "locationBlurb",
            `${location.split(" ")}`
        );
        await addData(path, "locationBlurb", locationBlurb);
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

    async function handlelocationHistorySubmit() {
        await replaceImage(
            locationHistory,
            "ItemInfo",
            "locationHistory",
            `${location.split(" ")}`
        );
        await addData(path, "locationHistory", locationHistory);
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
            Name: location,
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "ContentRef", `${location.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "ContentRef", `${location.split(" ")}`),
                data
            ).then(async () => {
                await handlelocationManualOfStyleSubmit();
                await handlelocationBlurbSubmit();
                await handleGeographyAndEcologySubmit();
                await handlelocationHistorySubmit();
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
                        <h2>Location Name</h2>
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
                            <h2>Location Manual of Style</h2>
                            <ContentForm
                                handleFormContents={handlelocationManualOfStyle}
                                isManualOfStyle={true}
                                section={"locationManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location Blurb</h2>
                            <ContentForm
                                handleFormContents={handlelocationBlurb}
                                isManualOfStyle={false}
                                section={"locationBlurb"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Location Geography And Ecology</h2>
                            <ContentForm
                                handleFormContents={handleGeographyAndEcology}
                                isManualOfStyle={false}
                                section={"geographyAndEcology"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location History</h2>
                            <ContentForm
                                handleFormContents={handleCulture}
                                isManualOfStyle={false}
                                section={"locationHistory"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location Culture</h2>
                            <ContentForm
                                handleFormContents={handlelocationHistory}
                                isManualOfStyle={false}
                                section={"culture"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                    <hr />
                    <button type="submit">Submit</button>
                </form>
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

export default LocationPageTemplate;
