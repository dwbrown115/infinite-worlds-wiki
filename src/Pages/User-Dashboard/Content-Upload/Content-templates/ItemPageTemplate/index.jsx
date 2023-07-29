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
    const collection = "Content/ContentType/Items";
    const router = useNavigate();

    const [item, setItem] = useState("");
    const [itemManualOfStyle, setItemManualOfStyle] = useState([]);
    const [itemBlurb, setItemBlurb] = useState([]);
    const [itemHistory, setItemHistory] = useState([]);
    const [itemUses, setItemUses] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${item.split(" ")}/ItemInfo/`;

    useEffect(() => {
        const storedItem = localStorage.getItem("item");
        if (storedItem) {
            setItem(storedItem);
        } else if (!storedItem) {
            // console.log("No item");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("item", item);
        localStorage.setItem(
            "itemManualOfStyle",
            JSON.stringify(itemManualOfStyle)
        );
        localStorage.setItem("itemBlurb", JSON.stringify(itemBlurb));
        localStorage.setItem("itemHistory", JSON.stringify(itemHistory));
        localStorage.setItem("itemUses", JSON.stringify(itemUses));
    }, [item, itemManualOfStyle, itemBlurb, itemHistory, itemUses]);

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

    function handleitemManualOfStyle(inputArray) {
        setItemManualOfStyle({
            contentType: "ItemitemManualOfStyle",
            content: inputArray,
        });
    }

    function handleitemBlurb(inputArray) {
        setItemBlurb({
            contentType: "ItemitemBlurb",
            content: inputArray,
        });
    }

    function handleitemHistory(inputArray) {
        setItemHistory({
            contentType: "ItemitemHistory",
            content: inputArray,
        });
    }

    function handleItemUses(inputArray) {
        setItemUses({
            contentType: "ItemUses",
            content: inputArray,
        });
    }

    async function handleitemManualOfStyleSubmit() {
        await replaceImage(
            itemManualOfStyle,
            "ItemInfo",
            "itemManualOfStyle",
            `${item.split(" ")}`
        );
        await addData(path, "itemManualOfStyle", itemManualOfStyle);
    }

    async function handleitemBlurbSubmit() {
        await replaceImage(
            itemBlurb,
            "ItemInfo",
            "itemBlurb",
            `${item.split(" ")}`
        );
        await addData(path, "itemBlurb", itemBlurb);
    }

    async function handleitemHistorySubmit() {
        await replaceImage(
            itemHistory,
            "ItemInfo",
            "itemHistory",
            `${item.split(" ")}`
        );
        await addData(path, "itemHistory", itemHistory);
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
            Name: item,
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
                await handleitemManualOfStyleSubmit();
                await handleitemBlurbSubmit();
                await handleitemHistorySubmit();
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
                        <h2>Item Name</h2>
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
                            <h2>Item Manual of Style</h2>
                            <ContentForm
                                handleFormContents={handleitemManualOfStyle}
                                isManualOfStyle={true}
                                section={"itemManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Item Blurb</h2>
                            <ContentForm
                                handleFormContents={handleitemBlurb}
                                isManualOfStyle={false}
                                section={"itemBlurb"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Item History</h2>
                            <ContentForm
                                handleFormContents={handleitemHistory}
                                isManualOfStyle={false}
                                section={"itemHistory"}
                                reset={confirm}
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

export default ItemPageTemplate;
