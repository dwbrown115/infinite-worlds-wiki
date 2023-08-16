import { useEffect, useState } from "react";
import {
    collection,
    query,
    onSnapshot,
    getFirestore,
} from "firebase/firestore";

import { firebase_app } from "../../firebase";
import { Loading, SortObjects } from "../../helpers";

function ChangeLog() {
    const db = getFirestore(firebase_app);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function grabContent() {
        const q = await query(collection(db, "ChangeLog"));

        const content = onSnapshot(q, (querySnapshot) => {
            let itemsArr = [];

            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
            });
            SortObjects(itemsArr, ["title"]);
            setData(itemsArr);
            setIsLoading(false);
            return () => content();
        });
    }

    useEffect(() => {
        document.title = "Change Log || Infinite Worlds Wiki";
        grabContent();
    }, []);

    function handlePageContent() {
        return (
            <div>
                {data?.map((item, key) => {
                    return (
                        <div key={key}>
                            <h2>{item.title}</h2>
                            <ul>
                                {item.changes.map((item, key) => {
                                    return (
                                        <li
                                            style={{ listStyle: "none" }}
                                            key={key}
                                        >
                                            {item.textItem}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div>
            <h1>Change Log</h1>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </div>
    );
}

export default ChangeLog;
