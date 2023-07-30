import firebase_app from "../config";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default async function getData(collection, id) {
    const db = getFirestore(firebase_app);
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        try {
            const data = docSnap.data();
            return data;
        } catch (e) {
            console.log(e);
        }
    } else {
        console.log("no such doc");
    }
}
