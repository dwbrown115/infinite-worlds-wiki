import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// import firebase_app from "../../firebase/config";
// import addData from "../../firebase/firestore/addData";
// import makeid from "../../helpers/randomString";
import { Loading, makeid } from "../../helpers";
import { firebase_app, addData } from "../../firebase";

function RequestAFeature() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const storage = getStorage(firebase_app);
    // const collection = "content";
    const user = auth.currentUser;
    const router = useNavigate();

    // const [collection, setCollection] = useState("content");
    const [id, setId] = useState(makeid(32));
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const collection = "FeatureRequests";
    // const editedBy = email;

    const grabUser = async () => {
        const collection = "users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            // setUserName(data["userName"]);
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
            setText("");
            setImage("");
            setImageUrl(null);
        } catch (e) {
            console.log(e);
        }
    };

    const handleImageUpload = async () => {
        const contentRef = ref(
            storage,
            `/${collection}/${image.name}+${makeid(16)}`
        );
        if (image != "") {
            await uploadBytes(contentRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (url) => {
                    const imageUrl = url;
                    const time = Date().toLocaleString();
                    const data = {
                        title: title,
                        text,
                        imageUrl,
                        createdBy: userName,
                        userEmail: email,
                        priority: "low",
                        createdAt: time,
                    };
                    handleUpload(data);
                });
            });
        } else {
            const time = Date().toLocaleString();
            const data = {
                title: title,
                text,
                createdBy: userName,
                userEmail: email,
                priority: "high",
                createdAt: time,
            };
            handleUpload(data);
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
            // console.log("doc doesn't exist");
            handleImageUpload();
        }
    };

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

    const handleReset = () => {
        document.getElementById("contentForm").reset();
        setTitle("");
        setText("");
        setImage("");
        setImageUrl(null);
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImageUrl(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    };

    const handlePageContent = () => {
        return (
            <>
                <div>
                    <h1>Request A Feature</h1>
                    <form id="contentForm" onSubmit={handleForm}>
                        <label>
                            Title:
                            <input
                                type="text"
                                placeholder="Title:"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <br />
                        <label>
                            Text:
                            <textarea
                                type="text"
                                placeholder="Text:"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <br />
                        <label>
                            Image:
                            <img src={imageUrl} />
                            <br />
                            <input
                                type="file"
                                name="myImage"
                                accept="image/*"
                                onChange={onImageChange}
                            />
                        </label>
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
                {/* <Link to={"/user"}>Go Back</Link> */}
            </>
        );
    };

    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </>
    );
}

export default RequestAFeature;
