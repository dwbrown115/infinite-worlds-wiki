import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { firebase_app } from "../../firebase";
import logOut from "../../firebase/auth/signout";
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
                if (user.emailVerified) {
                    grabUser();
                    setLoggedIn(true);
                }
            }
        });
    }, [user]);

    async function handleLogout() {
        console.log("Logging out");
        try {
            await logOut(user);
            router(0);
        } catch (e) {
            console.log(e);
            return false;
        }
    }
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
                                <div
                                    style={{ display: "flex" }}
                                    className="userHello"
                                >
                                    Welcome Back
                                    <div style={{ marginLeft: "5px" }}>
                                        <Link to={"/user"}>{userName}</Link>
                                    </div>
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
