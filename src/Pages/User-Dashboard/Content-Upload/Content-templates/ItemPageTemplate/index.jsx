import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function ItemPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Items";
    const router = useNavigate();

    const [item, setItem] = useState("");
    const [series, setSeries] = useState("");
    const [itemManualOfStyle, setItemManualOfStyle] = useState([]);
    const [itemBlurb, setItemBlurb] = useState([]);
    const [itemHistory, setItemHistory] = useState([]);
    const [itemUses, setItemUses] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${item.split(" ")}/`;

    useEffect(() => {
        const storedItem = localStorage.getItem("item");
        if (storedItem) {
            setItem(storedItem);
        } else if (!storedItem) {
            // console.log("No item");
        }

        const storedSeries = localStorage.getItem("series-item");
        if (storedSeries) {
            setSeries(storedSeries);
        } else if (!storedSeries) {
            // console.log("No series");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("item", item);
        localStorage.setItem("series-item", series);
        localStorage.setItem(
            "itemManualOfStyle",
            JSON.stringify(itemManualOfStyle)
        );
        localStorage.setItem("itemBlurb", JSON.stringify(itemBlurb));
        localStorage.setItem("itemHistory", JSON.stringify(itemHistory));
        localStorage.setItem("itemUses", JSON.stringify(itemUses));
    }, [item, itemManualOfStyle, itemBlurb, itemHistory, itemUses]);

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setItem("");
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

    function handleItemManualOfStyle(inputArray) {
        setEdited(true);
        setItemManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleItemBlurb(inputArray) {
        setEdited(true);
        setItemBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleItemHistory(inputArray) {
        setEdited(true);
        setItemHistory({
            contentType: "History",
            content: inputArray,
        });
    }

    function handleItemUses(inputArray) {
        setEdited(true);
        setItemUses({
            contentType: "Uses",
            content: inputArray,
        });
    }

    async function handleItemManualOfStyleSubmit() {
        await replaceImage(
            itemManualOfStyle,
            "ItemInfo",
            "ManualOfStyle",
            `${item.split(" ")}`
        );
        await addData(path, "ManualOfStyle", itemManualOfStyle);
        setProgress(12.5);
    }

    async function handleItemBlurbSubmit() {
        setProgress(25);
        await replaceImage(
            itemBlurb,
            "ItemInfo",
            "Blurb",
            `${item.split(" ")}`
        );
        await addData(path, "Blurb", itemBlurb);
        setProgress(37.5);
    }

    async function handleItemHistorySubmit() {
        setProgress(50);
        await replaceImage(
            itemHistory,
            "ItemInfo",
            "History",
            `${item.split(" ")}`
        );
        await addData(path, "History", itemHistory);
        setProgress(62.5);
    }

    async function handleItemUsesSubmit() {
        setProgress(75);
        await replaceImage(itemUses, "ItemInfo", "Uses", `${item.split(" ")}`);
        setProgress(87.5);
        await addData(path, "Uses", itemUses);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: item,
            Series: series,
            Type: "Item",
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "ContentRef", `${item.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "ContentRef", `${item.split(" ")}`),
                data
            ).then(async () => {
                await handleItemManualOfStyleSubmit();
                await handleItemBlurbSubmit();
                await handleItemHistorySubmit();
                await handleItemUsesSubmit();
                await setItem("");
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
                    <h1>Item Page Template</h1>
                    <div>
                        <h3>Item Name</h3>
                        <input
                            type="text"
                            placeholder="Item name:"
                            value={item}
                            onChange={(e) => {
                                setItem(e.target.value);
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
                            <h2>Item Manual of Style</h2>
                            <ContentForm
                                handleFormContents={handleItemManualOfStyle}
                                isManualOfStyle={true}
                                section={"itemManualOfStyle"}
                                reset={confirm}
                                edited={edited}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Item Blurb</h2>
                            <ContentForm
                                handleFormContents={handleItemBlurb}
                                isManualOfStyle={false}
                                section={"itemBlurb"}
                                reset={confirm}
                                edited={edited}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Item History</h2>
                            <ContentForm
                                handleFormContents={handleItemHistory}
                                isManualOfStyle={false}
                                section={"itemHistory"}
                                reset={confirm}
                                edited={edited}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Item Uses</h2>
                            <ContentForm
                                handleFormContents={handleItemUses}
                                isManualOfStyle={false}
                                section={"itemUses"}
                                reset={confirm}
                                edited={edited}
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

export default ItemPageTemplate;
