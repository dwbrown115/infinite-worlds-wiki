import React, { useState, useEffect } from "react";
import { getAuth, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import firebase_app from "../../firebase/config";
import signIn from "../../firebase/auth/signin";
import logOut from "../../firebase/auth/signout";

function ResetPassword() {
  const auth = getAuth(firebase_app);
  const router = useNavigate();

  // const [user, setUser] = useState(auth.currentUser);
  const [email, setEmail] = useState("jinsai115@gmail.com");
  const [oldPassword, setOldPassword] = useState("@Jivvc115");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [user, setUser] = useState(auth.currentUser);

  async function handlePasswordEmailForm(e) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Email sent");
      setEmail("");
    } catch (e) {
      console.log(e);
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    try {
      if (newPassword === confirmNewPassword) {
        if (user !== null) {
          await updatePassword(user, newPassword).then(
            async () => {
              try {
                console.log("Password successfully updated");
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
  }

  useEffect(() => {
    // handleLogout();
    // setUser(auth.currentUser);
    // console.log(user);
  }, []);

  return (
    <>
      <div>
        {user != null ? (
          <form onSubmit={handlePasswordUpdate}>
            <h2>New Password</h2>
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
        ) : (
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
        )}
        <Link to="/">back</Link>
      </div>
    </>
  );
}

export default ResetPassword;
