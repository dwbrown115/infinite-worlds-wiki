import firebase_app from "../config";
import { signOut, getAuth } from "firebase/auth";

export default async function logOut() {
  const auth = getAuth(firebase_app);
  let result = null,
    error = null;
  try {
    result = await signOut(auth)
      .then(() => {
        // console.log("signout successful");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    error = e;
    console.log(error);
  }
  return { result, error };
}
