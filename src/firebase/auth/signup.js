import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export default async function signUp(email, password) {
  const auth = getAuth(firebase_app);
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    console.log(result);
  } catch (e) {
    error = e;
    console.log(error);
  }

  return { result, error };
}
