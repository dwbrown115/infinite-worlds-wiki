import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    collection,
    query,
    onSnapshot,
    getFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import firebase_app from "../../firebase/config";
import { Content } from "../../components";
import { Loading, SortObjects, replacePartOfAString } from "../../helpers";

import "./content.scss";

function ContentDashboard() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const router = useNavigate();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const grabContent = async () => {
        const q = await query(collection(db, "ContentRef"));
        // console.log(q);
        const content = onSnapshot(q, (querySnapshot) => {
            let itemsArr = [];

            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
            });
            SortObjects(itemsArr, ["Series", "Type"]);
            // console.log(itemsArr);
            setItems(itemsArr);
            // console.log(itemsArr);
            setIsLoading(false);
            return () => content();
        });
        // console.log(SortObjects(items, ["Series", "Type"]));
    };

    const handleClick = () => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // console.log("user is logged in");
                return router("/user");
            } else {
                return router("/content");
            }
        });
    };

    useEffect(() => {
        grabContent();
    }, []);

    const handlePageContent = () => {
        return (
            <>
                <h1>Content Dashboard</h1>
                <div>
                    {items.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className="Item">
                                    <div>Series: </div>
                                    <div>{item.Series}</div>
                                </div>
                                <div className="Item">
                                    <div>Name: </div>
                                    <Link
                                        to={`/${replacePartOfAString(
                                            item.Type,
                                            " ",
                                            ""
                                        )}/${item.id}`}
                                    >
                                        {item.Name}
                                    </Link>
                                </div>
                                <div className="Item">
                                    <div>Type: </div>
                                    <div>{item.Type}</div>
                                </div>
                                <br />
                            </div>
                        );
                    })}
                </div>
                <Link to={"/user/upload"}>Create content</Link>
                <button onClick={handleClick}>Back</button>
            </>
        );
    };
    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </>
    );
}

export default ContentDashboard;
