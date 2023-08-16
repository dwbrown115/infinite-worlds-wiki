import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { Loading, makeid } from "../../helpers";
import { firebase_app, addData } from "../../firebase";

function ChangeLogAdd() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const router = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState([]);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const collection = "ChangeLog";

    const grabUser = async () => {
        const collection = "users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            setUserName(data["userName"]);
            setEmail(data["email"]);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpload = async (data) => {
        try {
            await addData(collection, `${makeid(16)}`, data);
            setIsLoading(true);
            console.log("successful");
            setIsLoading(false);
            document.getElementById("contentForm").reset();
            setTitle("");
            setText([]);
        } catch (e) {
            console.log(e);
        }
    };

    const handleForm = async (e) => {
        e.preventDefault();
        const docRef = doc(db, collection, title);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("doc already exists");
            // router(`/content/${title}`);
        } else {
            const time = Date().toLocaleString();
            const data = {
                title: title,
                changes: text,
                createdBy: userName,
                userEmail: email,
                createdAt: time,
            };
            handleUpload(data);
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    grabUser();
                } else {
                    router("/user/authentication");
                }
            } else {
                router("/");
            }
        });
    }, [user]);

    const handleReset = () => {
        document.getElementById("contentForm").reset();
        setTitle("");
        setText([]);
    };

    function handleTextAdd() {
        const textObject = { textItem: "" };
        setText([...text, textObject]);
    }

    useEffect(() => {
        document.title = "Add Change Log || Infinite Worlds Wiki";
    }, []);

    const handlePageContent = () => {
        return (
            <>
                <div>
                    <h1>Add Change Log</h1>
                    <form id="contentForm" onSubmit={handleForm}>
                        <label>
                            Version:
                            <br />
                            <input
                                type="text"
                                placeholder="Version number:"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <br />
                        {text.map((item, key) => {
                            return (
                                <div key={key}>
                                    <div>
                                        <div>Text:</div>
                                        <textarea
                                            type="text"
                                            placeholder="Text:"
                                            value={item.textItem}
                                            onChange={(e) => {
                                                const newText = [...text];
                                                newText[key].textItem =
                                                    e.target.value;
                                                setText(newText);
                                            }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newText = [...text];
                                                newText.splice(key, 1);
                                                setText(newText);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <br />
                                    <br />
                                </div>
                            );
                        })}
                        <button type="button" onClick={handleTextAdd}>
                            Add text
                        </button>
                        <br />
                        <br />
                        <div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </>
        );
    };

    return (
        <>
            {/* <Loading isLoading={isLoading} component={handlePageContent()} /> */}
            {handlePageContent()}
        </>
    );
}

export default ChangeLogAdd;
