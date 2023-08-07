import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import firebase_app from "../../../firebase/config";

function ForgotPassword() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();

    const [email, setEmail] = useState("jinsai115@gmail.com");

    async function handlePasswordEmailForm(e) {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            console.log("Email sent");
            setEmail("");
            router("/login");
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <form onSubmit={handlePasswordEmailForm}>
                    <h2>Reset password with email:</h2>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        // value={email}
                        type="email"
                        name="email"
                        id="knownEmail"
                        placeholder="Known email:"
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <Link to="/">back</Link>
        </div>
    );
}

export default ForgotPassword;
