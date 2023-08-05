import firebase_app from "../config";
import { doc, setDoc, getFirestore } from "firebase/firestore";

export default async function addData(collection, id, data) {
    const db = getFirestore(firebase_app);
    let result = null;

    try {
        result = await setDoc(doc(db, collection, id), data);
    } catch (e) {
        console.log(e);
    }

    return result;
}
