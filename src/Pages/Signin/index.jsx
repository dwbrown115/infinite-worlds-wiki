import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import signIn from "../../firebase/auth/signin";

import firebase_app from "../../firebase/config";

function SignIn() {
  const auth = getAuth(firebase_app);
  const navigate = useNavigate();
  const [email, setEmail] = useState("jinsai115@gmail.com");
  const [password, setPassword] = useState("@Jivvc115");

  const handleForm = async (event) => {
    event.preventDefault();

    try {
      await signIn(email, password);
      if (auth.currentUser.emailVerified != false) {
        navigate("/user");
      } else {
        navigate("/user/authentication");
      }
    } catch (e) {
      console.log(e);
    }
    const { result, error } = await signIn(email, password);

    if (error) {
      return console.log(error);
    } else {
      // else successful
      // console.log(result);
      return navigate("/user/authentication");
    }
  };

  function handleClick() {
    navigate("/signin/forgot-password");
  }
  return (
    <>
      <div className="form-wrapper">
        <div>Sign in</div>
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
    </>
  );
}

export default SignIn;
