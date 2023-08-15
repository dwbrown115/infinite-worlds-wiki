import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { signIn } from "../../firebase";

import firebase_app from "../../firebase/config";

function SignIn() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleForm = async (event) => {
        event.preventDefault();

        try {
            await signIn(email, password);
            if (auth.currentUser.emailVerified != false) {
                router("/user");
            } else {
                router("/user/authentication");
            }
        } catch (e) {
            console.log(e);
        }
        const { error } = await signIn(email, password);

        if (error) {
            return console.log(error);
        } else {
            // else successful
            // console.log(result);
            return router("/user/authentication");
        }
    };

    function handleClick() {
        router("/login/forgot-password");
    }
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <div className="form-wrapper">
                <h1>Sign in</h1>
                <form onSubmit={handleForm} className="form">
                    <label htmlFor="email">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            value={email}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email:"
                        />
                    </label>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            value={password}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password:"
                        />
                    </label>
                    <button type="submit">Sign in</button>
                </form>
                <br />
                <button onClick={handleClick}>Forgot password?</button>
                <Link to={"/"}>Home</Link>
            </div>
        </div>
    );
}

export default SignIn;
