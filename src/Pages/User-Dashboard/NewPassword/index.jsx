import { useState, useEffect } from "react";
import {
    getAuth,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import firebase_app from "../../../firebase/config";
import logOut from "../../../firebase/auth/signout";

function NewPassword() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();

    // const [user, setUser] = useState(auth.currentUser);
    const [oldPassword, setOldPassword] = useState("@Jivvc115");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const user = auth.currentUser;

    async function handlePasswordUpdate(e) {
        e.preventDefault();
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            oldPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential)
            .then(async () => {
                try {
                    if (newPassword === confirmNewPassword) {
                        if (user !== null) {
                            await updatePassword(user, newPassword).then(
                                async () => {
                                    try {
                                        console.log(
                                            "Password successfully updated"
                                        );
                                        await logOut(user);
                                        router("/signin");
                                    } catch (e) {
                                        console.log(e);
                                    }
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        } else {
                            console.log("How did you get this far??????");
                        }
                    } else {
                        console.log("Passwords do not match");
                    }
                } catch (e) {
                    console.log(e);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (!user.emailVerified) {
                    // console.log("user is logged in");
                    // console.log("user email is authenticated");
                    router("/user/authentication");
                }
            } else {
                router("/");
            }
        });
    }, []);

    return (
        <>
            <div>
                <form onSubmit={handlePasswordUpdate}>
                    <h2>Set a new password</h2>
                    <div>Current password:</div>
                    <input
                        type="password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        value={oldPassword}
                        id="oldPassword"
                        placeholder="Current password:"
                    />
                    <div>New password:</div>
                    <input
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        value={newPassword}
                        id="newPassword"
                        placeholder="New password:"
                    />
                    <input
                        type="password"
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        value={confirmNewPassword}
                        id="confirmNewPassword"
                        placeholder="Confirm new password:"
                    />
                    <button type="submit">Submit</button>
                </form>
                <Link to="/user">back</Link>
            </div>
        </>
    );
}

export default NewPassword;
