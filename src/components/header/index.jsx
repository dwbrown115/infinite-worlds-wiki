import { useState, useEffect } from "react";
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

import { firebase_app, logOut } from "../../firebase";
import { Searchbar } from "..";

import "./header.scss";

function Header() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    const grabUser = async () => {
        const collection = "users";
        const id = auth.currentUser.uid;
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        try {
            const data = docSnap.data();
            setUserName(data["userName"]);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                grabUser();
                setLoggedIn(true);
            }
        });
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
    return (
        <div>
            <div className="headerWrapper">
                <div>
                    {loggedIn === true ? (
                        <div style={{ display: "flex" }}>
                            <ul className="userActions">
                                <li>
                                    <Link to={"/user/upload"}>
                                        Create A Page
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/user/RequestAFeature"}>
                                        Request A Feature
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/user/ReportABug"}>
                                        Report A Bug
                                    </Link>
                                </li>
                            </ul>
                            <div className="userWrapper">
                                <div className="userHello">
                                    Welcome back{" "}
                                    <Link to={"/user"}>{userName}</Link>
                                </div>
                                <div className="logoutButtonWrapper">
                                    <button
                                        className="logoutButton"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex" }}>
                            <div>
                                <Link to={"/login"}>Sign in</Link>
                            </div>
                            <div>
                                <Link to={"/signup"}>Create Account</Link>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <Searchbar />
                </div>
            </div>
        </div>
    );
}

export default Header;
