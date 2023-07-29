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
    const collection = "Content/ContentType/Books";
    const router = useNavigate();

    const [book, setBook] = useState("");
    const [bookManualOfStyle, setBookManualOfStyle] = useState([]);
    const [bookBlurb, setBookBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [bookSynopsis, setBookSynopsis] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${book.split(" ")}/BookInfo/`;

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

    function handlebookManualOfStyle(inputArray) {
        setBookManualOfStyle({
            contentType: "BookbookManualOfStyle",
            content: inputArray,
        });
    }

    function handlebookBlurb(inputArray) {
        setBookBlurb({
            contentType: "BookbookBlurb",
            content: inputArray,
        });
    }

    function handleChapters(inputArray) {
        setChapters({
            contentType: "BookChapters",
            content: inputArray,
        });
    }

    function handlebookSynopsis(inputArray) {
        setBookSynopsis({
            contentType: "BookbookSynopsis",
            content: inputArray,
        });
    }

    async function handlebookManualOfStyleSubmit() {
        await replaceImage(
            bookManualOfStyle,
            "BookInfo",
            "bookManualOfStyle",
            `${book.split(" ")}`
        );
        await addData(path, "bookManualOfStyle", bookManualOfStyle);
    }

    async function handlebookBlurbSubmit() {
        await replaceImage(
            bookBlurb,
            "BookInfo",
            "bookBlurb",
            `${book.split(" ")}`
        );
        await addData(path, "bookBlurb", bookBlurb);
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

    async function handlebookSynopsisSubmit() {
        await replaceImage(
            bookSynopsis,
            "BookInfo",
            "bookSynopsis",
            `${book.split(" ")}`
        );
        await addData(path, "bookSynopsis", bookSynopsis);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            Name: book,
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
                    await handlebookManualOfStyleSubmit();
                    await handlebookBlurbSubmit();
                    await handleChaptersSubmit();
                    await handlebookSynopsisSubmit();
                    await handleResetConfirm();
                    setBook("");
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
                                handleFormContents={handlebookManualOfStyle}
                                isManualOfStyle={true}
                                section={"bookManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <hr />
                        <div>
                            <h2>Book Blurb</h2>
                            <ContentForm
                                handleFormContents={handlebookBlurb}
                                isManualOfStyle={false}
                                section={"bookBlurb"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h2>Book Chapters</h2>
                        <ContentForm
                            handleFormContents={handleChapters}
                            isManualOfStyle={true}
                            section={"chapters"}
                            reset={confirm}
                        />
                    </div>
                    <hr />
                    <div>
                        <h2>Book Synopsis</h2>
                        <ContentForm
                            handleFormContents={handlebookSynopsis}
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
