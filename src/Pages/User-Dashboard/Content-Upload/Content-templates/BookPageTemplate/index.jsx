import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentTemplateSection } from "../../../../../components";
import { ProgressBar } from "../../../../../helpers";
import firebase_app from "../../../../../firebase/config";

function BookPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Books";
    const router = useNavigate();

    const sections = [
        {
            section: "ManualOfStyle",
            sectionName: "Manual Of Style",
            optional: false,
            manualOfStyle: true,
        },
        {
            section: "Blurb",
            sectionName: "Blurb",
            optional: false,
            manualOfStyle: false,
        },
        {
            section: "Synopsis",
            sectionName: "Synopsis",
            optional: false,
            manualOfStyle: false,
        },
        {
            section: "Chapters",
            sectionName: "Chapters",
            optional: true,
            manualOfStyle: false,
        },
    ];
    const [book, setBook] = useState("");
    const [series, setSeries] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [progressCheck, setProgressCheck] = useState([]);

    const path = `${collection}/${book.split(" ")}/`;

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
    }, [book, series]);

    function handleProgressCheck(input) {
        setProgressCheck(input);
    }

    useEffect(() => {
        if (progress < 100) {
            const length = sections.length * 2;
            const Progress = progressCheck.length / length;
            const percentage = Progress * 100;
            setProgress(percentage);
        } else if (progress > 100) {
            setProgress(0);
            setProgressCheck([]);
            setLoading(false);
        }
    }, [progressCheck]);

    function handleResetConfirm() {
        setConfirm(true);
        setBook("");
        setSeries("");
        setTimeout(() => {
            setReset(false);
            setConfirm(false);
        }, 1);
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

    async function handleUploadTest(e) {
        e.preventDefault();
        setLoading(true);
        setSubmit(true);
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
                    await setBook("");
                    await setSeries("");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setEdited(false);
        // setProgress(100);
        setTimeout(() => {
            setProgress(0);
            setLoading(false);
        }, 100);
    }

    function handlePageContentTest() {
        return (
            <div style={{ width: "100%" }}>
                <form onSubmit={handleUploadTest}>
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
                    {sections.map((item, key) => {
                        return (
                            <div key={key}>
                                <ContentTemplateSection
                                    type={"Book"}
                                    section={item.section}
                                    sectionName={item.sectionName}
                                    name={book}
                                    path={path}
                                    submit={submit}
                                    manualOfStyle={item.manualOfStyle}
                                    optional={item.optional}
                                    handleProgress={handleProgressCheck}
                                    Reset={confirm}
                                    // handleProgress={handleProgressCheck}
                                />
                            </div>
                        );
                    })}
                    <hr />
                    {loading ? null : <button type="submit">Submit</button>}
                </form>
            </div>
        );
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <h1>Book Page Template</h1>
            {handlePageContentTest()}
            <br />
            <br />
            {loading ? (
                <div>
                    <h1>Uploading...</h1>
                    <ProgressBar percentage={progress} />
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

export default BookPageTemplate;
