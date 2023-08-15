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
        grabContent();
    }, []);

    // useEffect(() => {
    //     console.log(featureItems);
    //     console.log(bugItems);
    // }, [featureItems, bugItems]);

    function handleMapContent(name, array) {
        return (
            <div>
                <h2>{name}</h2>
                {array?.map((item, key) => {
                    // console.log(item);
                    return (
                        <div key={key}>
                            <hr />
                            <div style={{ display: "flex" }}>
                                <h3>Title:</h3>
                                <h3 style={{ marginLeft: "5px" }}>
                                    {item.title}
                                </h3>
                            </div>
                            <div>
                                <h3>Description:</h3>
                                <p>{item.text}</p>
                            </div>
                            <hr />
                            <div>
                                Created by: <b>{item.createdBy}</b>
                            </div>
                            <div>
                                Created at: <b>{item.createdAt}</b>
                            </div>
                            <div>
                                Priority: <b>{item.priority}</b>
                            </div>
                            {/* <hr /> */}
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
                {handleMapContent("Features", featureItems)}
                {handleMapContent("Bugs", bugItems)}
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
