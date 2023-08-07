import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import firebase_app from "../../firebase/config";

function Home() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                router("/user");
                // console.log("user is logged in");
            } else {
                router("/");
            }
        });
    }, [user]);
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <div>Home</div>
            <Link to={"/login"}>Sign in</Link>
            <Link to={"/signup"}>Sign up</Link>
            <Link to={"/content"}>Content Dashboard</Link>
        </div>
    );
}

export default Home;
