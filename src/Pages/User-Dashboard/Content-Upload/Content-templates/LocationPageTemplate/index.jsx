import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function LocationPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Locations";
    const router = useNavigate();

    const [location, setLocation] = useState("");
    const [locationType, setLocationType] = useState("");
    const [series, setSeries] = useState("");
    const [locationManualOfStyle, setLocationManualOfStyle] = useState([]);
    const [locationBlurb, setLocationBlurb] = useState([]);
    const [geographyAndEcology, setGeographyAndEcology] = useState([]);
    const [locationHistory, setLocationHistory] = useState([]);
    const [culture, setCulture] = useState([]);
    const [edited, setEdited] = useState(false);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${location.split(" ")}/`;

    useEffect(() => {
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            setLocation(storedLocation);
        }

        const storedSeries = localStorage.getItem("series-location");
        if (storedSeries) {
            setSeries(storedSeries);
        }

        const storedLocationType = localStorage.getItem("locationType");
        if (storedLocationType) {
            setLocationType(storedLocationType);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("location", location);
        localStorage.setItem("series-location", series);
        localStorage.setItem("locationType", locationType);
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
        localStorage.setItem("locationEdited", edited);
    }, [
        location,
        series,
        locationManualOfStyle,
        locationBlurb,
        geographyAndEcology,
        locationHistory,
        culture,
        edited,
    ]);

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setLocation("");
            setSeries("");
            setLocationType("");
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
        document.title = "Location Page Template || Infinite Worlds Wiki";
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

    function handleLocationManualOfStyle(inputArray) {
        setEdited(true);
        setLocationManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleLocationBlurb(inputArray) {
        setEdited(true);
        setLocationBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleGeographyAndEcology(inputArray) {
        setEdited(true);
        setGeographyAndEcology({
            contentType: "GeographyAndEcology",
            content: inputArray,
        });
    }

    function handleLocationHistory(inputArray) {
        setEdited(true);
        setLocationHistory({
            contentType: "History",
            content: inputArray,
        });
    }

    function handleCulture(inputArray) {
        setEdited(true);
        setCulture({
            contentType: "Culture",
            content: inputArray,
        });
    }

    async function handleLocationManualOfStyleSubmit() {
        await replaceImage(
            locationManualOfStyle,
            "ItemInfo",
            "ManualOfStyle",
            `${location.split(" ")}`
        );
        await addData(path, "ManualOfStyle", locationManualOfStyle);
        setProgress(10);
    }

    async function handleLocationBlurbSubmit() {
        setProgress(20);
        await replaceImage(
            locationBlurb,
            "ItemInfo",
            "Blurb",
            `${location.split(" ")}`
        );
        await addData(path, "Blurb", locationBlurb);
        setProgress(30);
    }

    async function handleGeographyAndEcologySubmit() {
        setProgress(40);
        await replaceImage(
            geographyAndEcology,
            "ItemInfo",
            "GeographyAndEcology",
            `${location.split(" ")}`
        );
        await addData(path, "GeographyAndEcology", geographyAndEcology);
        setProgress(50);
    }

    async function handleLocationHistorySubmit() {
        setProgress(60);
        await replaceImage(
            locationHistory,
            "ItemInfo",
            "History",
            `${location.split(" ")}`
        );
        await addData(path, "History", locationHistory);
        setProgress(70);
    }

    async function handleCultureSubmit() {
        setProgress(80);
        await replaceImage(
            culture,
            "ItemInfo",
            "Culture",
            `${location.split(" ")}`
        );
        await addData(path, "Culture", culture);
        setProgress(90);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: location,
            Series: series,
            locationType: locationType,
            Type: "Location",
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
                await handleLocationManualOfStyleSubmit();
                await handleLocationBlurbSubmit();
                await handleGeographyAndEcologySubmit();
                await handleLocationHistorySubmit();
                await handleCultureSubmit();
                await setLocation("");
                await setSeries("");
                await setLocationType("");
                setConfirm(true);
                setTimeout(() => {
                    setConfirm(false);
                }, 1);
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
                    <h1>Location Page Template</h1>
                    <div>
                        <h3>Location Name</h3>
                        <input
                            type="text"
                            placeholder="Location name:"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                setEdited(true);
                            }}
                            required
                        />
                    </div>
                    <div>
                        <h3>Location Type</h3>
                        {/* <label htmlFor="locationType">Type: </label> */}
                        <select
                            id="locationType"
                            onChange={(e) => {
                                setLocationType(e.target.value);
                                setEdited(true);
                            }}
                            value={locationType}
                            required
                        >
                            <option value="">Select a type</option>
                            <option value="Universe">Universe</option>
                            <option value="SolarSystem">Solar System</option>
                            <option value="Planet">Planet</option>
                            <option value="Continent">Continent</option>
                            <option value="Island">Island</option>
                            <option value="Nation">Nation</option>
                            <option value="City">City</option>
                            <option value="Town">Town</option>
                        </select>
                    </div>
                    <div>
                        <h3>Series</h3>
                        <input
                            type="text"
                            placeholder="Series:"
                            value={series}
                            onChange={(e) => {
                                setSeries(e.target.value), setEdited(true);
                            }}
                            required
                        />
                    </div>
                    <br />
                    <hr />
                    <div>
                        <div>
                            <h2>Location Manual of Style</h2>
                            <ContentForm
                                handleFormContents={handleLocationManualOfStyle}
                                isManualOfStyle={true}
                                section={"locationManualOfStyle"}
                                reset={confirm}
                                edited={"locationEdited"}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location Blurb</h2>
                            <ContentForm
                                handleFormContents={handleLocationBlurb}
                                isManualOfStyle={false}
                                section={"locationBlurb"}
                                reset={confirm}
                                edited={"locationEdited"}
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
                                edited={"locationEdited"}
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
                                edited={"locationEdited"}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Location Culture</h2>
                            <ContentForm
                                handleFormContents={handleLocationHistory}
                                isManualOfStyle={false}
                                section={"culture"}
                                reset={confirm}
                                edited={"locationEdited"}
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

export default LocationPageTemplate;
