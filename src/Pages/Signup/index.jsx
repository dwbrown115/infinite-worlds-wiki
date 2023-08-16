import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
} from "firebase/auth";
import algoliasearch from "algoliasearch";

import firebase_app from "../../firebase/config";
import { addData } from "../../firebase";
import { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY } from "../../../config";

function SignUp() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();
    var client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    var index = client.initIndex("InfiniteWorldsWikiUsers");

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async () => {
                    await sendEmailVerification(auth.currentUser);
                    try {
                        const collection = "users";
                        const id = auth.currentUser.uid;
                        const data = {
                            email,
                            userName,
                        };
                        await addData(collection, id, data);
                        setSuccess(true);
                        reset();
                        // navigate("/user/authentication");
                    } catch (e) {
                        setError(e);
                    }
                })
                .catch((e) => {
                    switch (e.code) {
                        case "auth/email-already-in-use":
                            setError(`Email address ${email} already in use.`);
                            break;
                        case "auth/invalid-email":
                            setError(`Email address ${email} is invalid.`);
                            break;
                        case "auth/operation-not-allowed":
                            break;
                        case "auth/weak-password":
                            setError(
                                "Password is not strong enough. Add additional characters including special characters and numbers."
                            );
                            break;
                        default:
                            setError(e.message);
                            break;
                    }
                });
        } catch (e) {
            setError(e);
        }
    };

    const handleForm = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Please make sure passwords match!");
        } else if (password === confirmPassword) {
            try {
                index.search(userName).then(function (responses) {
                    const resultsArray = [];
                    resultsArray.push(...responses.hits);
                    var searchedUsername = "";
                    // setError(resultsArray);
                    {
                        resultsArray.map((items) => {
                            // setError(items.userName);
                            searchedUsername = items.userName;
                        });
                    }
                    if (searchedUsername === userName) {
                        setError(`${userName} is already taken`);
                    } else {
                        handleSignUp();
                    }
                });
            } catch (e) {
                setError(e);
            }
        }
    };

    function reset() {
        setError("");
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // setSuccess(false);
    }

    useEffect(() => {
        document.title = "Sign Up || Infinite Worlds Wiki";
    }, []);
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <div className="form-wrapper">
                <h1>Sign up</h1>
                {/* <button onClick={debug}>Test</button> */}
                {/* onSubmit={handleForm} */}
                <div className="error" style={{ color: "red" }}>
                    {error}
                </div>
                {success === true ? (
                    <div className="success" style={{ color: "green" }}>
                        <div>Account succsessfully created.</div>
                        <div>Please check email for authentication.</div>
                        <button onClick={() => navigate("/login")}>
                            Sign in
                        </button>
                    </div>
                ) : null}
                <form onSubmit={handleForm} className="form">
                    <label htmlFor="userName">
                        <p>Username</p>
                        <input
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            value={userName}
                            type="text"
                            className="userName"
                            id="userName"
                            placeholder="Username:"
                        />
                    </label>
                    <label htmlFor="email">
                        <p>Email:</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            value={email}
                            type="email"
                            className="email"
                            id="email"
                            placeholder="Email:"
                        />
                    </label>
                    <label htmlFor="password">
                        <p>Password:</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            value={password}
                            type="password"
                            className="password"
                            id="password"
                            placeholder="Password:"
                        />
                    </label>
                    <label htmlFor="confirm-password">
                        <p>Confirm password:</p>
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            value={confirmPassword}
                            type="password"
                            className="confirm-password"
                            id="confirm-password"
                            placeholder="Confirm password:"
                        />
                    </label>
                    <br />
                    <br />
                    <div>
                        <button type="submit">Sign up</button>
                    </div>
                    <br />
                    <div>
                        <button type="button" onClick={reset}>
                            Reset
                        </button>
                    </div>
                </form>
                {/* <Link to={"/"}>Home</Link> */}
            </div>
        </div>
    );
}

export default SignUp;
