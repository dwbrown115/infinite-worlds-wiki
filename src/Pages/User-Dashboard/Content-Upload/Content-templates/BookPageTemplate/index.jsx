import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function BookPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Books";
    const router = useNavigate();

    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [book, setBook] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

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
            contentType: "BookManualOfStyle",
            content: inputArray,
        });
    }

    function handleBlurb(inputArray) {
        setBlurb({
            contentType: "BookBlurb",
            content: inputArray,
        });
    }

    function handleChapters(inputArray) {
        setChapters({
            contentType: "BookChapters",
            content: inputArray,
        });
    }

    function handleSynopsis(inputArray) {
        setSynopsis({
            contentType: "BookSynopsis",
            content: inputArray,
        });
    }

    async function handleManualOfStyleSubmit() {
        const path = `${collection}/${book.split(" ")}/BookInfo/`;
        await replaceImage(
            manualOfStyle,
            "BookInfo",
            "ManualOfStyle",
            `${book.split(" ")}`
        );
        await addData(path, "ManualOfStyle", manualOfStyle);
    }

    async function handleBlurbSubmit() {
        const path = `${collection}/${book.split(" ")}/BookInfo/`;
        await replaceImage(blurb, "BookInfo", "Blurb", `${book.split(" ")}`);
        await addData(path, "Blurb", blurb);
    }

    async function handleChaptersSubmit() {
        const path = `${collection}/${book.split(" ")}/BookInfo/`;
        await replaceImage(
            chapters,
            "BookInfo",
            "Chapters",
            `${book.split(" ")}`
        );
        await addData(path, "Chapters", chapters);
    }

    async function handleSynopsisSubmit() {
        const path = `${collection}/${book.split(" ")}/BookInfo/`;
        await replaceImage(
            synopsis,
            "BookInfo",
            "Synopsis",
            `${book.split(" ")}`
        );
        await addData(path, "Synopsis", synopsis);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            bookName: book,
            createdAt: time,
            createdBy: email,
        };
        const docRef = doc(db, "Books", `${book.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return alert("This book already exists!");
        } else {
            await setDoc(doc(db, "Books", `${book.split(" ")}`), data)
                .then(async () => {
                    await handleManualOfStyleSubmit();
                    await handleBlurbSubmit();
                    await handleChaptersSubmit();
                    await handleSynopsisSubmit();
                    await handleResetConfirm();
                    setBook("");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <>
            <div>
                <h1>Book Page Template</h1>
                <form onSubmit={handleUpload}>
                    <div>
                        <h2>Book Name</h2>
                        <input
                            type="text"
                            placeholder="Character name:"
                            value={book}
                            onChange={(e) => setBook(e.target.value)}
                            required
                        />
                    </div>
                    <hr />
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
                        <h2>Chapters</h2>
                        <ContentForm
                            handleFormContents={handleChapters}
                            isManualOfStyle={true}
                            section={chapters}
                            reset={reset}
                        />
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
                        <button type="submit">Submit</button>
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

export default BookPageTemplate;
