import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function PowerSystemPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/PowerSystems";
    const router = useNavigate();

    const [powerSystem, setPowerSystem] = useState("");
    const [series, setSeries] = useState("");
    const [powerSystemManualOfStyle, setPowerSystemManualOfStyle] = useState(
        []
    );
    const [powerSystemBlurb, setPowerSystemBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [uses, setUses] = useState([]);
    const [notableUsers, setNotableUsers] = useState([]);
    const [edited, setEdited] = useState(false);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${powerSystem.split(" ")}/`;

    useEffect(() => {
        const storedPowerSystem = localStorage.getItem("powerSystem");
        if (storedPowerSystem) {
            setpowerSystem(storedPowerSystem);
        } else if (!storedPowerSystem) {
            // console.log("No powerSystem");
        }

        const storedSeries = localStorage.getItem("series-powerSystem");
        if (storedSeries) {
            setSeries(storedSeries);
        } else if (!storedSeries) {
            // console.log("No series");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("powerSystem", powerSystem);
        localStorage.setItem("series-powerSystem", series);
        localStorage.setItem(
            "powerSystemManualOfStyle",
            JSON.stringify(powerSystemManualOfStyle)
        );
        localStorage.setItem(
            "powerSystemBlurb",
            JSON.stringify(powerSystemBlurb)
        );
        localStorage.setItem("info", JSON.stringify(info));
        localStorage.setItem("uses", JSON.stringify(uses));
        localStorage.setItem("notableUsers", JSON.stringify(notableUsers));
        localStorage.setItem("powerSystemEdited", edited);
    }, [
        powerSystem,
        series,
        powerSystemManualOfStyle,
        powerSystemBlurb,
        info,
        uses,
        notableUsers,
        edited
    ]);

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setPowerSystem("");
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

    function handlePowerSystemManualOfStyle(inputArray) {
        setEdited(true);
        setPowerSystemManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handlePowerSystemBlurb(inputArray) {
        setEdited(true);
        setPowerSystemBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleInfo(inputArray) {
        setEdited(true);
        setInfo({
            contentType: "Info",
            content: inputArray,
        });
    }

    function handleUses(inputArray) {
        setEdited(true);
        setUses({
            contentType: "Uses",
            content: inputArray,
        });
    }

    function handleNotableUsers(inputArray) {
        setEdited(true);
        setNotableUsers({
            contentType: "NotableUsers",
            content: inputArray,
        });
    }

    async function handlePowerSystemManualOfStyleSubmit() {
        await replaceImage(
            powerSystemManualOfStyle,
            "PowerSystemInfo",
            "ManualOfStyle",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "ManualOfStyle", powerSystemManualOfStyle);
        setProgress(10);
    }

    async function handlePowerSystemBlurbSubmit() {
        setProgress(20);
        await replaceImage(
            powerSystemBlurb,
            "PowerSystemInfo",
            "Blurb",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Blurb", powerSystemBlurb);
        setProgress(30);
    }

    async function handleInfoSubmit() {
        setProgress(40);
        await replaceImage(
            info,
            "PowerSystemInfo",
            "Info",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Info", info);
        setProgress(50);
    }

    async function handleUsesSubmit() {
        setProgress(60);
        await replaceImage(
            uses,
            "PowerSystemInfo",
            "Uses",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Uses", uses);
        setProgress(70);
    }

    async function handleNotableUsersSubmit() {
        setProgress(80);
        await replaceImage(
            notableUsers,
            "PowerSystemInfo",
            "NotableUsers",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "NotableUsers", notableUsers);
        setProgress(90);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: powerSystem,
            Series: series,
            Type: "Power System",
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "ContentRef", `${powerSystem.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "ContentRef", `${powerSystem.split(" ")}`),
                data
            ).then(async () => {
                await handlePowerSystemManualOfStyleSubmit();
                await handlePowerSystemBlurbSubmit();
                await handleInfoSubmit();
                await handleUsesSubmit();
                await handleNotableUsersSubmit();
                await setPowerSystem("");
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
                    <h1>Power System Page Template</h1>
                    <div>
                        <h3>Power System Name</h3>
                        <input
                            type="text"
                            placeholder="Power system name:"
                            value={powerSystem}
                            onChange={(e) => {
                                setPowerSystem(e.target.value);
                                setEdited(true);
                            }}
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
                        />
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Power System Manual of Style</h2>
                            <ContentForm
                                handleFormContents={
                                    handlePowerSystemManualOfStyle
                                }
                                isManualOfStyle={true}
                                section={"powerSystemManualOfStyle"}
                                reset={confirm}
                                edited={"powerSystemEdited"}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Power System Blurb</h2>
                            <ContentForm
                                handleFormContents={handlePowerSystemBlurb}
                                isManualOfStyle={false}
                                section={"powerSystemBlurb"}
                                reset={confirm}
                                edited={"powerSystemEdited"}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Power System History</h2>
                            <ContentForm
                                handleFormContents={handleInfo}
                                isManualOfStyle={false}
                                section={"info"}
                                reset={confirm}
                                edited={"powerSystemEdited"}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Power System Uses</h2>
                            <ContentForm
                                handleFormContents={handleUses}
                                isManualOfStyle={false}
                                section={"uses"}
                                reset={confirm}
                                edited={"powerSystemEdited"}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Notable Users</h2>
                            <ContentForm
                                handleFormContents={handleNotableUsers}
                                isManualOfStyle={false}
                                section={"notableUsers"}
                                reset={confirm}
                                edited={"powerSystemEdited"}
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

export default PowerSystemPageTemplate;
