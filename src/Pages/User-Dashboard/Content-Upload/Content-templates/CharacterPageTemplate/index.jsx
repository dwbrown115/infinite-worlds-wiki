import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function CharacterPageTemplate() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const collection = "Content/ContentType/Characters";
    const router = useNavigate();

    const [character, setCharacter] = useState("");
    const [characterManualOfStyle, setcharacterManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [info, setInfo] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const path = `${collection}/${character.split(" ")}/CharacterRelationship/`;

    useEffect(() => {
        const storedCharacter = localStorage.getItem("character");
        if (storedCharacter != null) {
            setCharacter(storedCharacter);
        } else if (!storedCharacter) {
            // console.log("No character");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("character", character);
        localStorage.setItem("characterManualOfStyle", JSON.stringify(characterManualOfStyle));
        localStorage.setItem("blurb", JSON.stringify(blurb));
        localStorage.setItem("info", JSON.stringify(info));
        localStorage.setItem("synopsis", JSON.stringify(synopsis));
        localStorage.setItem("relationships", JSON.stringify(relationships));
    }, [character, characterManualOfStyle, blurb, info, synopsis, relationships]);

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

    const handlecharacterManualOfStyle = (inputArray) => {
        setcharacterManualOfStyle({
            contentType: "CharacterManualofsyle",
            content: inputArray,
        });
        // setcharacterManualOfStyle(inputArray);
    };

    const handleBlurb = (inputArray) => {
        setBlurb({
            contentType: "CharacterBlurb",
            content: inputArray,
        });
    };

    const handleInfo = (inputArray) => {
        setInfo({
            contentType: "CharacterInfo",
            content: inputArray,
        });
    };

    const handleSynopsis = (inputArray) => {
        setSynopsis({
            contentType: "CharacterSynopsis",
            content: inputArray,
        });
    };

    const handleRelationships = (inputArray) => {
        setRelationships({
            contentType: "CharacterRelationships",
            content: inputArray,
        });
    };

    async function handleCharacterInfoSubmit() {
        await replaceImage(
            characterManualOfStyle,
            "CharacterInfo",
            "characterManualOfStyle",
            `${character.split(" ")}`
        );
        // console.log(JSON.parse(JSON.stringify(characterManualOfStyle)));
        await addData(path, "ManualOfSyle", characterManualOfStyle);

        await replaceImage(
            blurb,
            "CharacterInfo",
            "Burb",
            `${character.split(" ")}`
        );
        await addData(path, "Blurb", blurb);

        await replaceImage(
            blurb,
            "CharacterInfo",
            "Info",
            `${character.split(" ")}`
        );
        await addData(path, "Info", info);
    }

    async function handleCharacterSynopsisSubmit() {
        await replaceImage(
            synopsis,
            "CharacterSynopsis",
            "Synopsis",
            `${character.split(" ")}`
        );
        await addData(path, "Synopsis", synopsis);
    }
    async function handleCharacterRelationshipSubmit() {
        await replaceImage(
            relationships,
            "CharacterRelationship",
            "Relationships",
            `${character.split(" ")}`
        );
        await addData(path, "Relationships", relationships);
        console.log(relationships);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const time = Date().toLocaleString();
        const data = {
            characterName: character,
            createdBy: email,
            createdAt: time,
        };

        const docRef = doc(db, "Characters", `${character.split(" ")}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(
                "Doc already exists. Please edit intended page insead."
            );
        } else {
            console.log("doc doesn't exist");
            await setDoc(
                doc(db, "Characters", `${character.split(" ")}`),
                data
            ).then(async () => {
                await handleCharacterInfoSubmit();
                await handleCharacterSynopsisSubmit();
                await handleCharacterRelationshipSubmit();
                await handleResetConfirm();
                await setCharacter("");
            });
        }
    }

    return (
        <div className="CharacterPageTemplate">
            <hr />
            <form id="CharacterForm" onSubmit={handleUpload}>
                <h1>Character Info Page</h1>
                <div>
                    <h2>Character Name</h2>
                    <input
                        type="text"
                        placeholder="Character name:"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
                        required
                    />
                </div>
                <hr />
                <div>
                    <div>
                        <div>
                            <h2>Manual of syle</h2>
                            <ContentForm
                                handleFormContents={handlecharacterManualOfStyle}
                                isManualOfStyle={true}
                                section={"characterManualOfStyle"}
                                reset={confirm}
                            />
                        </div>
                        <div>
                            <h2>Quick Blurb</h2>
                            <ContentForm
                                handleFormContents={handleBlurb}
                                isManualOfStyle={false}
                                section={"blurb"}
                                reset={confirm}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Character Info</h2>
                    <ContentForm
                        handleFormContents={handleInfo}
                        isManualOfStyle={false}
                        section={"info"}
                        reset={confirm}
                    />
                </div>
                <hr />
                <div>
                    <h1>Character Synopsis Page</h1>
                    <ContentForm
                        handleFormContents={handleSynopsis}
                        isManualOfStyle={false}
                        section={"synopsis"}
                        reset={confirm}
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
                    />
                </div>
                <hr />
                <button type="submit">Submit</button>
            </form>
            <br />
            <button
                onClick={() => {
                    setReset(true);
                }}
            >
                Reset All
            </button>
            {reset === true ? (
                <button onClick={handleResetConfirm}>Confirm reset</button>
            ) : (
                <div />
            )}
            <br />
            <Link to={"/user/upload"}>Go Back</Link>
        </div>
    );
}

export default CharacterPageTemplate;
