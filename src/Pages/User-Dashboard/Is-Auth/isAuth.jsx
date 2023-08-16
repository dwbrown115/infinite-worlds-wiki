import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";

import firebase_app from "../../../firebase/config";

function IsAuth() {
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const router = useNavigate();

    const [emailSent, setEmailSent] = useState(false);

    const handleClick = async () => {
        // console.log(auth.currentUser.emailVerified);
        // console.log(user.emailVerified);
        try {
            await sendEmailVerification(auth.currentUser);
            setEmailSent(true);
            // console.log("New email sent");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        document.title = "Email Verification || Infinite Worlds Wiki";
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
            {emailSent === false ? (
                <div style={{ color: "red" }}>
                    <div>Please authenticate your email.</div>
                    <div style={{ color: "black" }}>
                        Check your inbox or spam folder for the email
                    </div>
                    <div style={{ color: "black" }}>
                        Or click the button below to resend the email
                    </div>
                </div>
            ) : (
                <div style={{ color: "green" }}>Email Sent</div>
            )}
            <div>
                <button onClick={handleClick}>Resend email</button>
            </div>
        </div>
    );
}

export default IsAuth;
