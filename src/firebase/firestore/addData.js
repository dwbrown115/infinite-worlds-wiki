import firebase_app from '../config'
import { doc, setDoc, getFirestore } from "firebase/firestore";

export default async function addData(colllection, id, data) {
  const db = getFirestore(firebase_app);
  let result = null;
  let error = null;

  try {
    result = await setDoc(doc(db, colllection, id), data, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
