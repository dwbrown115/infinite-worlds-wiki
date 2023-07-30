import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
} from "firebase/auth";
import algoliasearch from "algoliasearch";

import firebase_app from "../../firebase/config";
import addData from "../../firebase/firestore/addData";
import { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY } from "../../../config";

function SignUp() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();
    var client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY);
    var index = client.initIndex("InfiniteWorldsWikiUsers");
    const [userName, setUserName] = useState("jinsai115");
    const [email, setEmail] = useState("jinsai115@gmail.com");
    const [password, setPassword] = useState("@Jivvc115");
    const [confirmPassword, setConfirmPassword] = useState("@Jivvc115");

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async () => {
                    await sendEmailVerification(auth.currentUser);
                    console.log("email sent");
                    try {
                        const collection = "users";
                        const id = auth.currentUser.uid;
                        const data = {
                            email,
                            userName,
                        };
                        await addData(collection, id, data);
                        navigate("/user/authentication");
                    } catch (e) {
                        console.log(e);
                    }
                })
                .catch((e) => {
                    switch (e.code) {
                        case "auth/email-already-in-use":
                            console.log(
                                `Email address ${email} already in use.`
                            );
                            break;
                        case "auth/invalid-email":
                            console.log(`Email address ${email} is invalid.`);
                            break;
                        case "auth/operation-not-allowed":
                            break;
                        case "auth/weak-password":
                            console.log(
                                "Password is not strong enough. Add additional characters including special characters and numbers."
                            );
                            break;
                        default:
                            console.log(e.message);
                            break;
                    }
                });
        } catch (e) {
            console.log(e);
        }
    };

    const handleForm = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            console.log("Please make sure passwords match!");
        } else if (password === confirmPassword) {
            try {
                index.search(userName).then(function (responses) {
                    const resultsArray = [];
                    resultsArray.push(...responses.hits);
                    var searchedUsername = "";
                    // console.log(resultsArray);
                    {
                        resultsArray.map((items) => {
                            // console.log(items.userName);
                            searchedUsername = items.userName;
                        });
                    }
                    if (searchedUsername === userName) {
                        console.log(`${userName} is already taken`);
                    } else {
                        handleSignUp();
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <>
            <div className="form-wrapper">
                <div>Sign up</div>
                {/* <button onClick={debug}>Test</button> */}
                {/* onSubmit={handleForm} */}
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
                    <button type="submit">Sign up</button>
                </form>
                <Link to={"/"}>Home</Link>
            </div>
        </>
    );
}

export default SignUp;
