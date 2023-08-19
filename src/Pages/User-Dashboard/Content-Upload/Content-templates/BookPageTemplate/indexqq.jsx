import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function BookPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Books";
    const router = useNavigate();

    const [book, setBook] = useState("");
    const [series, setSeries] = useState("");
    const [bookManualOfStyle, setBookManualOfStyle] = useState([]);
    const [bookBlurb, setBookBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [bookSynopsis, setBookSynopsis] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [optional, setOptional] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${book.split(" ")}/`;

    // useEffect(() => {
    //     localStorage.setItem("edited", edited);
    // }, [edited]);

    useEffect(() => {
        const storedBook = localStorage.getItem("book");
        if (storedBook) {
            setBook(storedBook);
        }

        const storedSeries = localStorage.getItem("series");
        if (storedSeries) {
            setSeries(storedSeries);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("book", book);
        localStorage.setItem("series", series);
        localStorage.setItem("edited-book", edited);
        localStorage.setItem("series-character", series);
        localStorage.setItem(
            "bookManualOfStyle",
            JSON.stringify(bookManualOfStyle)
        );
        localStorage.setItem("bookBlurb", JSON.stringify(bookBlurb));
        localStorage.setItem("chapters", JSON.stringify(chapters));
        localStorage.setItem("bookSynopsis", JSON.stringify(bookSynopsis));
    }, [
        book,
        series,
        bookManualOfStyle,
        bookBlurb,
        chapters,
        bookSynopsis,
        edited,
    ]);

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setBook("");
            setSeries("");
            setTimeout(() => {
                setReset(false);
                setConfirm(false);
            }, 1);
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
        document.title = "Book Page Template || Infinite Worlds Wiki";
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
        setEdited(true);
        setBookManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
    }

    function handleBookBlurb(inputArray) {
        setEdited(true);
        setBookBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    }

    function handleChapters(inputArray) {
        setEdited(true);
        setChapters({
            contentType: "Chapters",
            content: inputArray,
        });
    }

    function handleBookSynopsis(inputArray) {
        setEdited(true);
        setBookSynopsis({
            contentType: "Synopsis",
            content: inputArray,
        });
    }

    async function handleBookManualOfStyleSubmit() {
        setProgress(12.5);
        await replaceImage(
            bookManualOfStyle,
            "BookInfo",
            "ManualOfStyle",
            `${book.split(" ")}`
        );
        await addData(path, "ManualOfStyle", bookManualOfStyle);
        setProgress(25);
    }

    async function handleBookBlurbSubmit() {
        setProgress(37.5);
        await replaceImage(
            bookBlurb,
            "BookInfo",
            "Blurb",
            `${book.split(" ")}`
        );
        await addData(path, "Blurb", bookBlurb);
        setProgress(50);
    }

    async function handleChaptersSubmit() {
        setProgress(62.5);
        if (optional == true) {
            await replaceImage(
                chapters,
                "BookInfo",
                "Chapters",
                `${book.split(" ")}`
            );
            await addData(path, "Chapters", chapters);
        }
        setProgress(75);
    }

    async function handleBookSynopsisSubmit() {
        setProgress(62.5);
        await replaceImage(
            bookSynopsis,
            "BookInfo",
            "Synopsis",
            `${book.split(" ")}`
        );
        await addData(path, "Synopsis", bookSynopsis);
        setProgress(87.5);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: book,
            Series: series,
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
                    await handleBookSynopsisSubmit();
                    await handleChaptersSubmit();
                    await setBook("");
                    await setSeries("");
                    setConfirm(true);
                    setTimeout(() => {
                        setConfirm(false);
                    }, 1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setEdited(false);
        setProgress(100);
        setLoading(false);
        setTimeout(() => {
            setProgress(0);
        }, 100);
    }

    function handlePageContent() {
        return (
            <div style={{ width: "100%" }}>
                <form onSubmit={handleUpload}>
                    <h1>Book Page Template</h1>
                    <div>
                        <h3>Book Name</h3>
                        <input
                            type="text"
                            placeholder="Book name:"
                            value={book}
                            onChange={(e) => {
                                setBook(e.target.value);
                                setEdited(true);
                            }}
                            required
                        />
                    </div>
                    <div>
                        <h3>Series Name</h3>
                        <input
                            type="text"
                            placeholder="Series name:"
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
                            <h2>Book Manual Of Style</h2>
                            <ContentForm
                                handleFormContents={handleBookManualOfStyle}
                                isManualOfStyle={true}
                                section={"bookManualOfStyle"}
                                reset={confirm}
                                edited={"edited-book"}
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
                                edited={"edited-book"}
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h2>Book Synopsis</h2>
                        <ContentForm
                            handleFormContents={handleBookSynopsis}
                            isManualOfStyle={false}
                            section={"bookSynopsis"}
                            reset={confirm}
                            edited={"edited-book"}
                        />
                    </div>
                    <hr />
                    <div>
                        <h2>Book Chapters</h2>
                        {optional === true ? (
                            <div>
                                <ContentForm
                                    handleFormContents={handleChapters}
                                    isManualOfStyle={true}
                                    section={"chapters"}
                                    reset={confirm}
                                    edited={"edited-book"}
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
        );
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {handlePageContent()}
        </div>
    );
}

export default BookPageTemplate;
