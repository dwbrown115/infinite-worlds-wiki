import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

import firebase_app from "../../firebase/config";
import signUp from "../../firebase/auth/signup";
import addData from "../../firebase/firestore/addData";
// import emailAuthentication from "../../firebase/auth/emailAuthentication";

function SignUp() {
  const auth = getAuth(firebase_app);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("jinsai115");
  const [email, setEmail] = useState("jinsai115@gmail.com");
  const [password, setPassword] = useState("@Jivvc115");

  const handleForm = async (event) => {
    event.preventDefault();
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
          } catch (e) {
            console.log(e);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      // await signUp(email, password);
      // // console.log("success");
      // await emailAuthentication(email);
      // try {
      //   const auth = getAuth(firebase_app);
      //   const user = auth.currentUser;
      //   const collection = "users";
      //   const id = user.uid;
      //   const data = {
      //     email,
      //     userName,
      //   };
      //   await addData(collection, id, data);
      //   // console.log("success");
      //   return navigate("/user");
      // } catch (e) {
      //   console.log(e);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  const debug = () => {
    console.log(import.meta.env.VITE_FIREBASE_API_KEY);
    console.log(FIREBASE_API_KEY);
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
            <p>Email</p>
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
            <p>Password</p>
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
          <button type="submit">Sign up</button>
        </form>
        <Link to={"/"}>Home</Link>
      </div>
    </>
  );
}

export default SignUp;
