import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentTemplateSection } from "../../../components";
import { ProgressBar, replacePartOfAString } from "../../../helpers";
import { firebase_app, addData } from "../../../firebase";

function ContentUpload() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content";
    const router = useNavigate();

    let Books = [
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
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Chapters",
            sectionName: "Chapters",
            optional: true,
            manualOfStyle: false,
        },
    ];

    let Characters = [
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
            section: "Info",
            sectionName: "Info",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Equipment",
            sectionName: "Equipment",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "PowersAndAbilities",
            sectionName: "Powers And Abilities",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Synopsis",
            sectionName: "Synopsis",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Relationships",
            sectionName: "Relationships",
            optional: true,
            manualOfStyle: false,
        },
    ];

    let Events = [
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
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Impact",
            sectionName: "Impact",
            optional: true,
            manualOfStyle: false,
        },
    ];

    let Factions = [
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
            section: "History",
            sectionName: "History",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Objectives",
            sectionName: "Objectives",
            optional: true,
            manualOfStyle: false,
        },
        {
            section: "Members",
            sectionName: "Members",
            optional: true,
            manualOfStyle: true,
        },
    ];

    let Items = [
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
            section: "Description",
            sectionName: "Description",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "History",
            sectionName: "History",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "Uses",
            sectionName: "Uses",
            optional: true,
            manualOfStyle: true,
        },
    ];

    let Locations = [
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
            section: "GeographyAndEcology",
            sectionName: "Geography And Ecology",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "History",
            sectionName: "History",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "Culture",
            sectionName: "Culture",
            optional: true,
            manualOfStyle: true,
        },
    ];

    let PowerSystems = [
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
            section: "Info",
            sectionName: "Info",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "Uses",
            sectionName: "Uses",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "NotableUsers",
            sectionName: "Notable Users",
            optional: true,
            manualOfStyle: true,
        },
    ];

    let Races = [
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
            section: "Characteristics",
            sectionName: "Characteristics",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "Culture",
            sectionName: "Culture",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "History",
            sectionName: "History",
            optional: true,
            manualOfStyle: true,
        },
        {
            section: "NotableMembers",
            sectionName: "Notable Members",
            optional: true,
            manualOfStyle: true,
        },
    ];

    let Custom = [
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
    ];
    const [name, setName] = useState("");
    const [series, setSeries] = useState("");
    const [type, setType] = useState("");
    const [bookNumber, setBookNumber] = useState(0);
    const [locationType, setLocationType] = useState("");
    const [newSectionName, setNewSectionName] = useState("");
    const [addSection, setAddSection] = useState(false);
    const [alert, setAlert] = useState("");
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [progressCheck, setProgressCheck] = useState([]);

    useEffect(() => {
        setAlert("");
        setName("");
        const storedName = localStorage.getItem(`${type}Name`);
        if (storedName) {
            setName(storedName);
            // console.log(storedName);
        }

        setSeries("");
        const storedSeries = localStorage.getItem(`${type}Series`);
        if (storedSeries) {
            setSeries(storedSeries);
        }
    }, [type]);

    useEffect(() => {
        setEdited(true);
        localStorage.setItem(`${type}Name`, name);
        localStorage.setItem(`${type}Series`, series);
        localStorage.setItem(`edited-${type}`, edited);
    }, [name, series]);

    useEffect(() => {
        if (progress < 100) {
            const Section = eval(type);
            const length = Section * 2;
            const Progress = progressCheck.length / length;
            const percentage = Progress * 100;
            setProgress(percentage);
        } else if (progress >= 100) {
            setProgress(0);
            setProgressCheck([]);
            setLoading(false);
        }
    }, [progressCheck]);

    useEffect(() => {
        document.title = "Upload Content || Infinite Worlds Wiki";
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

    function handleProgressCheck(input) {
        setProgressCheck(input);
    }

    function handleResetConfirm() {
        setConfirm(true);
        setName("");
        setSeries("");
        if (type === "Locations") {
            setLocationType("");
        }
        if (type === "Books") {
            setBookNumber(0);
        }
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

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        let data = {
            Name: name,
            Series: series,
            Type: type.slice(0, -1),
            sections: [],
            createdAt: time,
            createdBy: email,
        };
        if (type === "Locations") {
            data = { ...data, locationType: locationType };
        }
        if (type === "Books") {
            data = { ...data, bookNumber: bookNumber };
        }
        const docRef = doc(db, "ContentRef", `${name.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setAlert(
                "This page already exists! Please choose a different name, or edit that page."
            );
        } else {
            await setDoc(doc(db, "ContentRef", `${name.split(" ")}`), data)
                .then(async () => {
                    setSubmit(true);
                    setTimeout(() => {
                        setName("");
                        setSeries("");
                        if (type === "Locations") {
                            setLocationType("");
                        }
                        if (type === "Books") {
                            setBookNumber(0);
                        }
                    }, 10);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setEdited(false);
        setTimeout(() => {
            setProgress(0);
            setLoading(false);
        }, 100);
    }

    function addNewSection(section) {
        const newSection = {
            section: replacePartOfAString(newSectionName, " ", ","),
            sectionName: newSectionName,
            optional: false,
            manualOfStyle: false,
        };

        // section.push(newSection);
        // section = [...section, newSection];
        // console.log(section);
        // setAddSection(false);
        // setNewSectionName("");
    }

    function handlePageContent(section) {
        // console.log(eval(section));
        const Section = eval(section);
        const path = `${collection}/${section}/${name.split(" ")}`;
        return (
            <div>
                {Section ? (
                    <div>
                        {Section?.map((item, key) => {
                            return (
                                <div key={key}>
                                    <hr />
                                    <ContentTemplateSection
                                        type={type}
                                        section={item.section}
                                        sectionName={item.sectionName}
                                        name={name}
                                        path={path}
                                        submit={submit}
                                        manualOfStyle={item.manualOfStyle}
                                        optional={item.optional}
                                        handleProgress={handleProgressCheck}
                                        Reset={confirm}
                                        order={key}
                                    />
                                </div>
                            );
                        })}
                        {/* <hr /> */}
                        {/* {addSection === false ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAddSection(true);
                                    }}
                                >
                                    Add New Section
                                </button>
                            </div>
                        ) : (
                            // <div>
                            //     <h3>New Section</h3>
                            //     <div>
                            //         <h3>Section Name</h3>
                            //         <input
                            //             type="text"
                            //             placeholder="Section Name:"
                            //             value={newSectionName}
                            //             onChange={(e) => {
                            //                 setNewSectionName(e.target.value);
                            //             }}
                            //             required
                            //         />
                            //     </div>
                            //     <div>
                            //         <button
                            //             type="button"
                            //             onClick={() => {
                            //                 addNewSection(Section);
                            //             }}
                            //         >
                            //             Add Section
                            //         </button>
                            //     </div>
                            //     <div>
                            //         <button
                            //             type="button"
                            //             onClick={() => {
                            //                 setAddSection(false);
                            //             }}
                            //         >
                            //             Cancel
                            //         </button>
                            //     </div>
                            // </div>
                            <div />
                        )} */}
                        {/* {JSON.stringify(Section)} */}
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div>
            <h1>Content Templates</h1>
            <div style={{ color: "red" }}>{alert}</div>
            <form onSubmit={handleUpload}>
                <div>
                    <h3>Template</h3>
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setEdited(true);
                        }}
                    >
                        <option value="">Please select template</option>
                        <option value="Books">Book</option>
                        <option value="Characters">Character</option>
                        <option value="Events">Event</option>
                        <option value="Factions">Faction</option>
                        <option value="Items">Item</option>
                        <option value="Locations">Location</option>
                        <option value="PowerSystems">Power System</option>
                        <option value="Races">Race</option>
                        {/* <option value="Custom">Custom Template</option> */}
                    </select>
                </div>
                <div>
                    <h3>Name</h3>
                    <input
                        type="text"
                        placeholder="Name:"
                        value={name}
                        onChange={(e) => {
                            if (type !== "") {
                                setName(e.target.value);
                                setEdited(true);
                            } else if (type === "") {
                                setAlert("Please select a template");
                            }
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
                            if (type !== "") {
                                setSeries(e.target.value);
                                setEdited(true);
                            } else if (type === "") {
                                setAlert("Please select a template");
                            }
                        }}
                        required
                    />
                </div>
                {type === "Books" ? (
                    <div>
                        <h3>Book Order Number</h3>
                        <input
                            type="number"
                            placeholder="Book Order Number:"
                            value={bookNumber}
                            onChange={(e) => {
                                setBookNumber(e.target.value);
                                setEdited(true);
                            }}
                            min={0}
                            required
                        />
                    </div>
                ) : null}
                {type === "Locations" ? (
                    <div>
                        <h3>Location Type</h3>
                        <select
                            id="locationType"
                            onChange={(e) => {
                                setLocationType(e.target.value);
                                setEdited(true);
                            }}
                            value={locationType}
                            required
                        >
                            <option value="">Select a type</option>
                            <option value="Universe">Universe</option>
                            <option value="SolarSystem">Solar System</option>
                            <option value="Planet">Planet</option>
                            <option value="Continent">Continent</option>
                            <option value="Island">Island</option>
                            <option value="Nation">Nation</option>
                            <option value="City">City</option>
                            <option value="Town">Town</option>
                        </select>
                    </div>
                ) : null}
                <br />
                {handlePageContent(type)}
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
        </div>
    );
}

export default ContentUpload;
