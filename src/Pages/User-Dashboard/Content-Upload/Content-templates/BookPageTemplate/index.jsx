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
    const collection = "Content/Books";
    const router = useNavigate();

    const [book, setBook] = useState("");
    const [bookManualOfStyle, setBookManualOfStyle] = useState([]);
    const [bookBlurb, setBookBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [bookSynopsis, setBookSynopsis] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [optional, setOptional] = useState(false);

    const path = `${collection}/${book.split(" ")}/`;

    useEffect(() => {
        const storedBook = localStorage.getItem("book");
        if (storedBook) {
            setBook(storedBook);
        } else if (!storedBook) {
            // console.log("No book");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("book", book);
        localStorage.setItem(
            "bookManualOfStyle",
            JSON.stringify(bookManualOfStyle)
        );
        localStorage.setItem("bookBlurb", JSON.stringify(bookBlurb));
        localStorage.setItem("chapters", JSON.stringify(chapters));
        localStorage.setItem("bookSynopsis", JSON.stringify(bookSynopsis));
    }, [book, bookManualOfStyle, bookBlurb, chapters, bookSynopsis]);

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

    function handleBookManualOfStyle(inputArray) {
        setBookManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleBookBlurb(inputArray) {
        setBookBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleChapters(inputArray) {
        setChapters({
            contentType: "Chapters",
            content: inputArray,
        });
    }

    function handleBookSynopsis(inputArray) {
        setBookSynopsis({
            contentType: "Synopsis",
            content: inputArray,
        });
    }

    async function handleBookManualOfStyleSubmit() {
        await replaceImage(
            bookManualOfStyle,
            "BookInfo",
            "ManualOfStyle",
            `${book.split(" ")}`
        );
        await addData(path, "ManualOfStyle", bookManualOfStyle);
    }

    async function handleBookBlurbSubmit() {
        await replaceImage(
            bookBlurb,
            "BookInfo",
            "Blurb",
            `${book.split(" ")}`
        );
        await addData(path, "Blurb", bookBlurb);
    }

    async function handleChaptersSubmit() {
        await replaceImage(
            chapters,
            "BookInfo",
            "Chapters",
            `${book.split(" ")}`
        );
        await addData(path, "Chapters", chapters);
    }

    async function handleBookSynopsisSubmit() {
        await replaceImage(
            bookSynopsis,
            "BookInfo",
            "Synopsis",
            `${book.split(" ")}`
        );
        await addData(path, "Synopsis", bookSynopsis);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            Name: book,
            Type: "Book",
            createdAt: time,
            createdBy: email,
        };
        const docRef = doc(db, "ContentRef", `${book.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return alert("This book already exists!");
        } else {
            await setDoc(doc(db, "ContentRef", `${book.split(" ")}`), data)
                .then(async () => {
                    await handleBookManualOfStyleSubmit();
                    await handleBookBlurbSubmit();
                    await handleChaptersSubmit();
                    await handleBookSynopsisSubmit();
                    await handleResetConfirm();
                    await handleResetConfirm();
                    await setBook("");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    function handlePageContent() {
        return (
            <div>
                <h1>Book Page Template</h1>
                <form onSubmit={handleUpload}>
                    <div>
                        <h2>Book Name</h2>
                        <input
                            type="text"
                            placeholder="Book name:"
                            value={book}
                            onChange={(e) => setBook(e.target.value)}
                            required
                        />
                    </div>
                    <hr />
                    <div>
                        <div>
                            <h2>Book Manual Of Style</h2>
                            <ContentForm
                                handleFormContents={handleBookManualOfStyle}
                                isManualOfStyle={true}
                                section={"bookManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Book Blurb</h2>
                            <ContentForm
                                handleFormContents={handleBookBlurb}
                                isManualOfStyle={false}
                                section={"bookBlurb"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                    <hr />
                    <h2>Book Chapters Section</h2>
                    {optional === true ? (
                        <div>
                            <ContentForm
                                handleFormContents={handleChapters}
                                isManualOfStyle={true}
                                section={"chapters"}
                                reset={confirm}
                            />
                            <button onClick={() => setOptional(false)}>
                                Remove Chapters Section
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setOptional(true)}>
                            Add Chapters
                        </button>
                    )}
                    <hr />
                    <div>
                        <h2>Book Synopsis</h2>
                        <ContentForm
                            handleFormContents={handleBookSynopsis}
                            isManualOfStyle={false}
                            section={"bookSynopsis"}
                            reset={confirm}
                        />
                    </div>
                    <hr />
                    <div>
                        <button type="submit">Submit</button>
                    </div>
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
        );
    }

    return <>{handlePageContent()}</>;
}

export default BookPageTemplate;
