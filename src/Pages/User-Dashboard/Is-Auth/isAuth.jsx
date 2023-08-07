import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";

import firebase_app from "../../../firebase/config";

function IsAuth() {
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const router = useNavigate();

    const handleClick = async () => {
        // console.log(auth.currentUser.emailVerified);
        // console.log(user.emailVerified);
        try {
            await sendEmailVerification(auth.currentUser);
            console.log("New email sent");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    router("/");
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
    }, [user]);

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <div>Please authenticate your email.</div>
            <div>Go to your email to accomplish that</div>
            <button onClick={handleClick}>Resend email</button>
            <Link to={"/"}>Back</Link>
        </div>
    );
}

export default IsAuth;
