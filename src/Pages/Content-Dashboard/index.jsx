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

    async function grabContent() {
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
    }

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
        document.title = "Content Dashboard || Infinite Worlds Wiki";
        grabContent();
    }, []);

    const handlePageContent = () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
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
            </div>
        );
    };
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
            {/* <Link to={"/user/upload"}>Create content</Link> */}
            {/* <div>
                <button onClick={handleClick}>Back</button>
            </div> */}
        </div>
    );
}

export default ContentDashboard;
