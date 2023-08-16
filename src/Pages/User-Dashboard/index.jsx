import { useState, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    collection,
    doc,
    getDoc,
    query,
    onSnapshot,
    getFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { firebase_app } from "../../firebase";
import logOut from "../../firebase/auth/signout";
import { Content } from "../../components";
import { Loading } from "../../helpers";

function UserDashboard() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const grabUser = async () => {
        const collection = "users";
        const id = auth.currentUser.uid;
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            setUserName(data["userName"]);
            setEmail(data["email"]);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    };

    const grabContent = async () => {
        const q = await query(collection(db, "content_backup"));
        // console.log(q);
        const content = onSnapshot(q, (querySnapshot) => {
            let itemsArr = [];

            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
            });
            setItems(itemsArr);
            // console.log(itemsArr);
            return () => content();
        });
    };

    useLayoutEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    grabUser();
                    grabContent();
                    // console.log(items);
                    // console.log("user is logged in");
                    // console.log("user email is authenticated");
                } else {
                    router("/user/authentication");
                    // console.log("please check your email");
                }
            } else {
                router("/");
            }
        });
        // grabContent();
    }, [user]);

    const handleLogout = async () => {
        try {
            await logOut(user);
            // router("/");
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const handlePageContent = () => {
        return (
            <div>
                <div>
                    <div>
                        <div>
                            <h3>Username:</h3>
                            <div>{userName}</div>
                        </div>
                        <div>
                            <h3>Email:</h3>
                            <div>{email}</div>
                        </div>
                    </div>
                    <br />
                    {items.map((item) => {
                        return (
                            <Content
                                key={item.id}
                                id={item.id}
                                originalId={item.originalId}
                                title={item.title}
                                text={item.text}
                                edit={item.editedBy}
                                time={item.timestamp}
                                Id={item.id}
                                admin={true}
                                edits={item.editsMade}
                            />
                        );
                    })}
                    <br />
                    <br />
                    <div>
                        <button onClick={handleLogout}>Sign out</button>
                    </div>
                    <br />
                    <div>
                        <button
                            onClick={() => {
                                router("/auth/reset-password");
                            }}
                        >
                            Change password
                        </button>
                    </div>
                    {/* <br /> */}
                    <br />
                    <div>
                        <Link to={"/user/upload"}>Create Content</Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
            {/* <div>{handlePageContent()}</div> */}
        </div>
    );
}

export default UserDashboard;
