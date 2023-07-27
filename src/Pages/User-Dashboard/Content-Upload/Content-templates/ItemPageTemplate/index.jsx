import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function ItemPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Items";
    const router = useNavigate();

    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [history, setHistory] = useState([]);
    const [itemUses, setItemUses] = useState([]);
    const [item, setItem] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${item.split(" ")}/ItemInfo/`;

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
            contentType: "ItemManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "ItemBlurb",
            content: inputArray,
        });
    }

    function handleHistory(inputArray) {
        setHistory({
            contentType: "ItemHistory",
            content: inputArray,
        });
    }

    function handleItemUses(inputArray) {
        setItemUses({
            contentType: "ItemUses",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        await replaceImage(
            manualOfStyle,
            "ItemInfo",
            "ManualOfStyle",
            `${item.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
    }

    async function handleBlurbSubmit() {
        await replaceImage(blurb, "ItemInfo", "Blurb", `${item.split(" ")}`);
        await addData(path, "Blurb", blurb);
    }

    async function handleHistorySubmit() {
        await replaceImage(
            history,
            "ItemInfo",
            "History",
            `${item.split(" ")}`
        );
        await addData(path, "History", history);
    }

    async function handleItemUsesSubmit() {
        await replaceImage(
            itemUses,
            "ItemInfo",
            "ItemUses",
            `${item.split(" ")}`
        );
        await addData(path, "ItemUses", itemUses);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            ItemName: item,
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "Items", `${item.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "Characters", `${item.split(" ")}`),
                data
            ).then(async () => {
                await handleManualOfStyleSubmit();
                await handleBlurbSubmit();
                await handleHistorySubmit();
                await handleItemUsesSubmit();
                await handleResetConfirm();
                await setItem("");
            });
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleUpload}>
                    <h1>Item Page Template</h1>
                    <div>
                        <h2>Item name</h2>
                        <input
                            type="text"
                            placeholder="Item name:"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
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
                    <hr />
                    <div>
                        <div>
                            <h2>Item History</h2>
                            <ContentForm
                                handleFormContents={handleHistory}
                                isManualOfStyle={false}
                                section={history}
                                reset={reset}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Item Uses</h2>
                            <ContentForm
                                handleFormContents={handleItemUses}
                                isManualOfStyle={false}
                                section={itemUses}
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

export default ItemPageTemplate;
