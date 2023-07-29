import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
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
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

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
    }, [
        powerSystem,
        powerSystemManualOfStyle,
        powerSystemBlurb,
        info,
        uses,
        notableUsers,
    ]);

    function handleResetConfirm() {
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
        setPowerSystemManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handlePowerSystemBlurb(inputArray) {
        setPowerSystemBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleInfo(inputArray) {
        setInfo({
            contentType: "Info",
            content: inputArray,
        });
    }

    function handleUses(inputArray) {
        setUses({
            contentType: "Uses",
            content: inputArray,
        });
    }

    function handleNotableUsers(inputArray) {
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
        await addData(
            path,
            "ManualOfStyle",
            powerSystemManualOfStyle
        );
    }

    async function handlePowerSystemBlurbSubmit() {
        await replaceImage(
            powerSystemBlurb,
            "PowerSystemInfo",
            "Blurb",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Blurb", powerSystemBlurb);
    }

    async function handleInfoSubmit() {
        await replaceImage(
            info,
            "PowerSystemInfo",
            "Info",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Info", info);
    }

    async function handleUsesSubmit() {
        await replaceImage(
            uses,
            "PowerSystemInfo",
            "Uses",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Uses", uses);
    }

    async function handleNotableUsersSubmit() {
        await replaceImage(
            notableUsers,
            "PowerSystemInfo",
            "NotableUsers",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "NotableUsers", notableUsers);
    }

    async function handleUpload(e) {
        e.preventDefault();
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
                            onChange={(e) => setPowerSystem(e.target.value)}
                        />
                    </div>
                    <div>
                        <h3>Series</h3>
                        <input
                            type="text"
                            placeholder="Series:"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
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
                                k
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
                            />
                        </div>
                    </div>
                    <hr />
                    <button type="submit">Submit</button>
                </form>
                <br />
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
                <Link to={"/user/upload"}>Go Back</Link>
            </div>
        </>
    );
}

export default PowerSystemPageTemplate;
