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
    const collection = "Content/ContentType/PowerSystems";
    const router = useNavigate();

    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [uses, setUses] = useState([]);
    const [notableUsers, setNotableUsers] = useState([]);
    const [powerSystem, setPowerSystem] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
 
    const path = `${collection}/${powerSystem.split(" ")}/PowerSystemInfo/`;

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
            contentType: "PowerSystemManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "PowerSystemBlurb",
            content: inputArray,
        });
    }

    function handleInfo(inputArray) {
        setInfo({
            contentType: "PowerSystemInfo",
            content: inputArray,
        });
    }

    function handleUses(inputArray) {
        setUses({
            contentType: "PowerSystemUses",
            content: inputArray,
        });
    }

    function handleNotableUsers(inputArray) {
        setNotableUsers({
            contentType: "PowerSystemNotableUsers",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        await replaceImage(
            manualOfStyle,
            "PowerSystemInfo",
            "ManualOfStyle",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
    }

    async function handleBlurbSubmit() {
        await replaceImage(
            blurb,
            "PowerSystemInfo",
            "Blurb",
            `${powerSystem.split(" ")}`
        );
        await addData(path, "Blurb", blurb);
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
            PowerSystemName: powerSystem,
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "PowerSystems", `${powerSystem.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "Characters", `${powerSystem.split(" ")}`),
                data
            ).then(async () => {
                await handleManualOfStyleSubmit();
                await handleBlurbSubmit();
                await handleInfoSubmit();
                await handleUsesSubmit();
                await handleNotableUsersSubmit();
                await handleResetConfirm();
                await setPowerSystem("");
            });
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleUpload}>
                    <h1>Power System Page Template</h1>
                    <div>
                        <h2>Power System name</h2>
                        <input
                            type="text"
                            placeholder="Power system name:"
                            value={powerSystem}
                            onChange={(e) => setPowerSystem(e.target.value)}
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
                                reset={reset}k
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
                        <div>
                            <h2>PowerSystem History</h2>
                            <ContentForm
                                handleFormContents={handleInfo}
                                isManualOfStyle={false}
                                section={info}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>PowerSystem Uses</h2>
                            <ContentForm
                                handleFormContents={handleUses}
                                isManualOfStyle={false}
                                section={uses}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Notable Users</h2>
                            <ContentForm
                            handleFormContents={handleNotableUsers}
                            isManualOfStyle={false}
                            section={notableUsers}
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

export default PowerSystemPageTemplate;
