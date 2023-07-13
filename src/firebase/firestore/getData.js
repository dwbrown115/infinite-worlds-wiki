import firebase_app from "../config";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default async function getDoument(collection, id) {
  const db = getFirestore(firebase_app);
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  // let error = null;

  // return { result, error };
}
