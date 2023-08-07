import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, ProgressBar } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function CharacterPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/Characters";
    const router = useNavigate();

    const [character, setCharacter] = useState("");
    const [series, setSeries] = useState("");
    const [characterManualOfStyle, setCharacterManualOfStyle] = useState([]);
    const [characterBlurb, setCharacterBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [characterPowersAndAbilities, setCharacterPowersAndAbilities] =
        useState([]);
    const [characterSynopsis, setCharacterSynopsis] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [progress, setProgress] = useState(0);

    const path = `${collection}/${character.split(" ")}/`;

    useEffect(() => {
        const storedCharacter = localStorage.getItem("character");
        if (storedCharacter != null) {
            setCharacter(storedCharacter);
        } else if (!storedCharacter) {
            // console.log("No character");
        }

        const storedSeries = localStorage.getItem("series-character");
        if (storedSeries) {
            setSeries(storedSeries);
        } else if (!storedSeries) {
            // console.log("No series");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("character", character);
        localStorage.setItem("series-character", series);
        localStorage.setItem("edited-character", edited);
        localStorage.setItem(
            "characterManualOfStyle",
            JSON.stringify(characterManualOfStyle)
        );
        localStorage.setItem("characterBlurb", JSON.stringify(characterBlurb));
        localStorage.setItem("info", JSON.stringify(info));
        localStorage.setItem("equipment", JSON.stringify(equipment));
        localStorage.setItem(
            "powersAndAbilities",
            JSON.stringify(characterPowersAndAbilities)
        );
        localStorage.setItem(
            "characterSynopsis",
            JSON.stringify(characterSynopsis)
        );
        localStorage.setItem("relationships", JSON.stringify(relationships));
    }, [
        character,
        series,
        characterManualOfStyle,
        characterBlurb,
        info,
        characterSynopsis,
        relationships,
        edited,
    ]);

    function handleResetConfirm() {
        setEdited(false);
        if (reset == true) {
            setConfirm(true);
            setCharacter("");
            setSeries("");
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
                    // console.log("user email is authenticated");
                } else {
                    router("/user/authentication");
                    // console.log("please check your email");
                }
            } else {
                router("/");
            }
        });
    }, [user]);

    const handleCharacterManualOfStyle = (inputArray) => {
        setEdited(true);
        setCharacterManualOfStyle({
            contentType: "Manualofsyle",
            content: inputArray,
        });
        // setCharacterManualOfStyle(inputArray);
    };

    const handleCharacterBlurb = (inputArray) => {
        setEdited(true);
        setCharacterBlurb({
            contentType: "Blurb",
            content: inputArray,
        });
    };

    const handleInfo = (inputArray) => {
        setEdited(true);
        setInfo({
            contentType: "Info",
            content: inputArray,
        });
    };

    const handleEquipment = (inputArray) => {
        setEdited(true);
        setEquipment({
            contentType: "Equipment",
            content: inputArray,
        });
    };

    const handleCharacterPowersAndAbilities = (inputArray) => {
        setEdited(true);
        setCharacterPowersAndAbilities({
            contentType: "PowersAndAbilities",
            content: inputArray,
        });
    };

    const handleCharacterSynopsis = (inputArray) => {
        setEdited(true);
        setCharacterSynopsis({
            contentType: "Synopsis",
            content: inputArray,
        });
    };

    const handleRelationships = (inputArray) => {
        setEdited(true);
        setRelationships({
            contentType: "Relationships",
            content: inputArray,
        });
    };

    async function handleCharacterInfoSubmit() {
        setProgress(7.14);
        await replaceImage(
            characterManualOfStyle,
            "CharacterInfo",
            "ManualOfStyle",
            `${character.split(" ")}`
        );
        // console.log(JSON.parse(JSON.stringify(characterManualOfStyle)));
        await addData(path, "ManualOfStyle", characterManualOfStyle);
        setProgress(14.28);

        setProgress(21.42);
        await replaceImage(
            characterBlurb,
            "CharacterInfo",
            "Burb",
            `${character.split(" ")}`
        );
        await addData(path, "Blurb", characterBlurb);
        setProgress(28.56);

        setProgress(35.7);
        await replaceImage(
            info,
            "CharacterInfo",
            "Info",
            `${character.split(" ")}`
        );
        await addData(path, "Info", info);
        setProgress(42.84);

        setProgress(49.98);
        await replaceImage(
            equipment,
            "CharacterInfo",
            "Equipment",
            `${character.split(" ")}`
        );
        await addData(path, "Equipment", equipment);
        setProgress(57.12);

        setProgress(64.26);
        await replaceImage(
            characterPowersAndAbilities,
            "CharacterInfo",
            "PowersAndAbilities",
            `${character.split(" ")}`
        );
        await addData(path, "PowersAndAbilities", characterPowersAndAbilities);
        setProgress(71.4);
    }

    async function handleCharacterSynopsisSubmit() {
        setProgress(78.57);
        await replaceImage(
            characterSynopsis,
            "CharacterSynopsis",
            "Synopsis",
            `${character.split(" ")}`
        );
        await addData(path, "Synopsis", characterSynopsis);
        setProgress(85.71);
    }
    async function handleCharacterRelationshipSubmit() {
        setProgress(92.85);
        await replaceImage(
            relationships,
            "CharacterRelationship",
            "Relationships",
            `${character.split(" ")}`
        );
        await addData(path, "Relationships", relationships);
        setProgress(99.99);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setLoading(true);
        const time = Date().toLocaleString();
        const data = {
            Name: character,
            Series: series,
            Type: "Character",
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "ContentRef", `${character.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(doc(db, "ContentRef", `${character.split(" ")}`), data)
                .then(async () => {
                    await handleCharacterInfoSubmit();
                    await handleCharacterSynopsisSubmit();
                    await handleCharacterRelationshipSubmit();
                    await setCharacter("");
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

    return (
        <div className="CharacterPageTemplate">
            <hr />
            <form id="CharacterForm" onSubmit={handleUpload}>
                <h1>Character Info Page</h1>
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
                        <div>
                            <h2>Character Manual of syle</h2>
                            <ContentForm
                                handleFormContents={
                                    handleCharacterManualOfStyle
                                }
                                isManualOfStyle={true}
                                section={"characterManualOfStyle"}
                                reset={confirm}
                                edited={"edited-character"}
                            />
                        </div>
                        <div>
                            <h2>Character Blurb</h2>
                            <ContentForm
                                handleFormContents={handleCharacterBlurb}
                                isManualOfStyle={false}
                                section={"characterBlurb"}
                                reset={confirm}
                                edited={"edited-character"}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h2>Character Info</h2>
                        <ContentForm
                            handleFormContents={handleInfo}
                            isManualOfStyle={false}
                            section={"info"}
                            reset={confirm}
                            edited={"edited-character"}
                        />
                    </div>
                    <div>
                        <h2>Character Equipment</h2>
                        <ContentForm
                            handleFormContents={handleEquipment}
                            isManualOfStyle={false}
                            section={"info"}
                            reset={confirm}
                            edited={"edited-character"}
                        />
                    </div>
                    <div>
                        <h2>Character Powers and Abilities</h2>
                        <ContentForm
                            handleFormContents={
                                handleCharacterPowersAndAbilities
                            }
                            isManualOfStyle={false}
                            section={"info"}
                            reset={confirm}
                            edited={"edited-character"}
                        />
                    </div>
                </div>
                <hr />
                <div>
                    <h1>Character Synopsis Page</h1>
                    <ContentForm
                        handleFormContents={handleCharacterSynopsis}
                        isManualOfStyle={false}
                        section={"characterSynopsis"}
                        reset={confirm}
                        edited={"edited-character"}
                    />
                </div>
                <hr />
                <div>
                    <h1>Character Relationships Page</h1>
                    <ContentForm
                        handleFormContents={handleRelationships}
                        isManualOfStyle={false}
                        section={"relationships"}
                        reset={confirm}
                        edited={"edited-character"}
                    />
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

export default CharacterPageTemplate;
