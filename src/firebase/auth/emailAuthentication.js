import firebase_app from "../config";
import { sendSignInLinkToEmail, getAuth } from "firebase/auth";

export default async function emailAuthentication(email) {
  const actionSettings = {
    url: "http://localhost:5173/user/authentication",
    handleCodeInApp: true,
  };
  const auth = getAuth(firebase_app);
  let result = null,
    error = null;
  try {
    result = await sendSignInLinkToEmail(auth, email, actionSettings)
      .then(() => {
        console.log("email successfully sent");
        window.localStorage.setItem("emailForSignIn", email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  } catch (e) {
    error = e;
    console.log(error);
  }
  return { result, error };
}
