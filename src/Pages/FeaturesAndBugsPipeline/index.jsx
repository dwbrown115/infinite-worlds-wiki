import { useEffect, useState } from "react";
import {
    collection,
    query,
    onSnapshot,
    getFirestore,
} from "firebase/firestore";

import { Loading, SortObjects } from "../../helpers";
import { firebase_app } from "../../firebase";

function FeaturesAndBugsPipeline() {
    const db = getFirestore(firebase_app);

    const [featureItems, setFeatureItems] = useState([]);
    const [bugItems, setBugItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function grabContent() {
        const featureQ = await query(collection(db, "FeatureRequests"));
        const bugQ = await query(collection(db, "BugReports"));

        const featureContent = onSnapshot(featureQ, (querySnapshot) => {
            let itemsArr = [];

            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
            });
            SortObjects(itemsArr, ["priority"]);
            setFeatureItems(itemsArr);
            setIsLoading(false);
            return () => featureContent();
        });

        const bugContent = onSnapshot(bugQ, (querySnapshot) => {
            let itemsArr = [];

            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
            });
            SortObjects(itemsArr, ["priority"]);
            setBugItems(itemsArr);
            setIsLoading(false);
            return () => bugContent();
        });
        // setIsLoading(false);
    }

    useEffect(() => {
        document.title = "Features and Bugs Pipeline || Infinite Worlds Wiki";
        grabContent();
    }, []);

    function handleMapContent(array) {
        return (
            <div>
                {array?.map((item, key) => {
                    // console.log(item);
                    return (
                        <div
                            style={{ marginLeft: "20px", marginRight: "20px" }}
                            key={key}
                        >
                            {/* <hr /> */}
                            <div style={{ display: "flex" }}>
                                {/* <h3 style={{ marginBottom: "0px" }}>Title:</h3> */}
                                <h3
                                    style={{
                                        marginLeft: "5px",
                                        marginBottom: "0px",
                                    }}
                                >
                                    {item.title}
                                </h3>
                            </div>
                            <div style={{ marginLeft: "30px" }}>
                                <div>
                                    <h3>Description:</h3>
                                    <p>{item.text}</p>
                                </div>
                                {/* <hr /> */}
                                <div>
                                    Created by: <br />
                                    <b>{item.createdBy}</b>
                                </div>
                                <br />
                                <div>
                                    Created at: <br />
                                    <b>{item.createdAt}</b>
                                </div>
                                <br />
                                <div>
                                    Priority: <br />
                                    <b>{item.priority}</b>
                                </div>
                                {/* <hr /> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    function handlePageContent() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <h1>Features and Bugs Pipeline</h1>
                <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                    <h2>Features</h2>
                    {featureItems.length === 0 ? (
                        <h3 style={{ marginLeft: "20px", marginRight: "20px" }}>
                            All features have been added
                        </h3>
                    ) : (
                        handleMapContent(featureItems)
                    )}
                    {/* <br /> */}
                    {/* <hr /> */}
                    <h2>Bugs</h2>
                    {bugItems.length === 0 ? (
                        <div
                            style={{ marginLeft: "20px", marginRight: "20px" }}
                        >
                            <h3>All known bugs have been fixed</h3>
                        </div>
                    ) : (
                        handleMapContent(bugItems)
                    )}
                </div>
                {/* <hr /> */}
            </div>
        );
    }
    return (
        <div>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </div>
    );
}

export default FeaturesAndBugsPipeline;
