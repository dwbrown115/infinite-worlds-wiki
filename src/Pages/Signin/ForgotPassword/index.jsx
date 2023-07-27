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
            router("/signin");
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <>
            <>
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
            </>
            <Link to="/">back</Link>
        </>
    );
}

export default ForgotPassword;
