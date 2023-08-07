import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getFirestore,
    setDoc,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase_app from "../../../firebase/config";
import { Loading } from "../../../helpers";
import { makeid, compareObjectArrays } from "../../../helpers";

function ContentEdit() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const storage = getStorage(firebase_app);
    const dataArray = [];
    const router = useNavigate();

    const collection = "content";
    const [id, setId] = useState(window.location.href.split("user/edit/")[1]);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [currentImgUrl, setCurrentImgUrl] = useState("");
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageThere, setImageThere] = useState(false);
    const [email, setEmail] = useState("");

    const editedBy = email;

    const grabUser = async () => {
        const collection = "users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            setEmail(data["email"]);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const grabContent = async () => {
        // router.push(url);
        setId(window.location.href.split("user/edit/")[1]);
        const collection = "content";
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            // console.log(data);
            dataArray.push(data);
            setTitle(data["title"]);
            setText(data["text"]);
            setCurrentTitle(data["title"]);
            setCurrentText(data["text"]);
            setCurrentImgUrl(data["imageUrl"]);
            setImageThere(dataArray.some((el) => el.imageUrl));
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImageUrl(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    };

    const handleContentEdit = async (data) => {
        const collectionBackup = collection + "_backup";
        const time = Date.now();
        const contentRef = doc(db, `${collectionBackup}`, `${id}_${time}`);
        try {
            await setDoc(contentRef, data);
            // console.log("success");
            setIsLoading(true);
            router(0);
        } catch (e) {
            console.log(e);
        }
    };

    const handleImageUpload = async () => {
        const docRef = doc(db, collection, id);
        const contentRef = ref(
            storage,
            `/${collection}/${image.name}+${makeid(16)}`
        );
        if (image != "") {
            await uploadBytes(contentRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (url) => {
                    const imageUrl = url;
                    const time = Date().toLocaleString();
                    let timestampData = {
                        editedBy: editedBy,
                        timestamp: time,
                    };
                    let data = {
                        title: title,
                        text: text,
                        imageUrl: imageUrl,
                        timestampArray: arrayUnion(timestampData),
                    };
                    let data_before = [
                        {
                            title: currentTitle,
                        },
                        { text: currentText },
                        { imageUrl: currentImgUrl },
                    ];
                    let data_now = [
                        {
                            title: title,
                        },
                        { text: text },
                        { imageUrl: imageUrl },
                    ];
                    let differences = [];
                    let data_new = {
                        originalId: id.split("_")[0],
                        editedBy: editedBy,
                        timestamp: time,
                        editsMade: differences,
                    };
                    await updateDoc(docRef, data);
                    compareObjectArrays(data_before, data_now, differences);
                    handleContentEdit(data_new);
                });
            });
        } else {
            // const time =
            //   new Date().toLocaleString() +
            //   " " +
            //   Intl.DateTimeFormat().resolvedOptions().timeZone;
            const time = Date().toLocaleString();

            let timestampData = {
                editedBy: editedBy,
                timestamp: time,
            };
            let data = {
                title: title,
                text: text,
                timestampArray: arrayUnion(timestampData),
            };
            let data_before = [
                {
                    title: currentTitle,
                },
                { text: currentText },
            ];
            let data_now = [
                {
                    title: title,
                },
                { text: text },
            ];
            let differences = [];
            let data_new = {
                originalId: id.split("_")[0],
                editedBy: editedBy,
                timestamp: time,
                editsMade: differences,
            };
            await updateDoc(docRef, data);
            compareObjectArrays(data_before, data_now, differences);
            handleContentEdit(data_new);
            console.log(data_new);
        }
    };

    const handleForm = async (e) => {
        e.preventDefault();
        // console.log(image);
        handleImageUpload();
    };

    const handleReset = () => {
        document.getElementById("contentForm").reset();
        setTitle(currentTitle);
        setText(currentText);
        setImage("");
    };

    const handleDelete = async () => {
        const docRef = doc(db, collection, id);
        await deleteDoc(docRef);
        router("/content");
    };

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    grabUser();
                    grabContent();
                    // console.log("user email is authenticated");
                } else {
                    router("/user/authentication");
                    // console.log("please check your email");
                }
            } else {
                router("/");
                console.log("You don't have the authority to edit this");
            }
        });
    }, [id]);

    const handleDebug = () => {
        const time = Date.now();
        const d = new Date(time);

        console.log(d);
    };

    const handlePageContent = () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <div>
                    <h3>Edit Content</h3>
                    <form id="contentForm" onSubmit={handleForm}>
                        <label>
                            Current title:
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
                            Current text:
                            <textarea
                                type="text"
                                placeholder="Text:"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <br />
                            <br />
                            Current image:
                            {imageThere === true ? (
                                <img src={currentImgUrl} alt="img-jpg" />
                            ) : (
                                <div />
                            )}
                            <div>
                                <br />
                                New image:
                                <img src={newImageUrl} />
                                <br />
                                <input
                                    type="file"
                                    name="myImage"
                                    accept="image/*"
                                    onChange={onImageChange}
                                />
                            </div>
                        </label>
                        <br />
                        <div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleReset}>
                                Reset
                            </button>
                            <button onClick={handleDelete} type="button">
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
                <Link to={"/content"}>Go Back</Link>
            </div>
        );
    };
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
            <button onClick={handleDebug}>debug</button>
        </div>
    );
}

export default ContentEdit;
