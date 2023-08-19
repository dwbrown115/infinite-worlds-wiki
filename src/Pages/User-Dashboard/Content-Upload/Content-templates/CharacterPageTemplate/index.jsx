import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentTemplateSection } from "../../../../../components";
import { ProgressBar } from "../../../../../helpers";
import firebase_app from "../../../../../firebase/config";

function CharacterPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Characters";
    const router = useNavigate();

    const infoSections = [
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
            section: "PowersAndAbilities",
            sectionName: "Powers And Abilities",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Equipment",
            sectionName: "Equipment",
            optional: true,
            manualOfStyle: false,
        },
    ];

    const synopsisSections = [
        {
            section: "Synopsis",
            sectionName: "Synopsis",
            optional: true,
            manualOfStyle: false,
        },
    ];

    const relationshipSections = [
        {
            section: "Relationships",
            sectionName: "Relationships",
            optional: true,
            manualOfStyle: false,
        },
    ];

    const [character, setCharacter] = useState("");
    const [series, setSeries] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [progressCheck, setProgressCheck] = useState([]);

    const path = `${collection}/${character.split(" ")}/`;

    useEffect(() => {
        const storedCharacter = localStorage.getItem("character");
        if (storedCharacter) {
            setCharacter(storedCharacter);
        }

        const storedSeries = localStorage.getItem("series");
        if (storedSeries) {
            setSeries(storedSeries);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("character", character);
        localStorage.setItem("series", series);
        localStorage.setItem("edited-character", edited);
    }, [character, series]);

    function handleProgressCheck(input) {
        setProgressCheck(input);
    }

    useEffect(() => {
        if (progress < 100) {
            const allLength =
                infoSections.length +
                synopsisSections.length +
                relationshipSections.length;
            const length = allLength * 2;
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
        setCharacter("");
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
        document.title = "Character Page Template || Infinite Worlds Wiki";
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

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        setSubmit(true);
        const time = Date().toLocaleString();
        const data = {
            Name: character,
            Series: series,
            Type: "Character",
            createdAt: time,
            createdBy: email,
        };
        const docRef = doc(db, "ContentRef", `${character.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return alert("This character already exists!");
        } else {
            await setDoc(doc(db, "ContentRef", `${character.split(" ")}`), data)
                .then(async () => {
                    await setCharacter("");
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

    function handlePageContent(sections) {
        return (
            <div style={{ width: "100%" }}>
                {sections.map((item, key) => {
                    return (
                        <div key={key}>
                            <hr />
                            <ContentTemplateSection
                                type={"Character"}
                                section={item.section}
                                sectionName={item.sectionName}
                                name={character}
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
            </div>
        );
    }
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <h1>Character Pages Template</h1>
            <form onSubmit={handleUpload}>
                <div>
                    <h3>Character Name</h3>
                    <input
                        type="text"
                        placeholder="Character name:"
                        value={character}
                        onChange={(e) => {
                            setCharacter(e.target.value);
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
                <hr />
                <div>
                    <h1>Character Info Page</h1>
                    {handlePageContent(infoSections)}
                </div>
                <hr />
                <div>
                    <h1>Character Synopsis Page</h1>
                    {handlePageContent(synopsisSections)}
                </div>
                <hr />
                <div>
                    <h1>Character Relationships Page</h1>
                    {handlePageContent(relationshipSections)}
                </div>
                <hr />
                {loading ? null : <button type="submit">Submit</button>}
            </form>
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

export default CharacterPageTemplate;
