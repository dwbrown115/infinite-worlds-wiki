import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    onSnapshot,
    getFirestore,
} from "firebase/firestore";
import { Link } from "react-router-dom";

// import { firebase_app } from "../../../firebase";
import { firebase_app } from "../../firebase";
import { filterAndOrganize } from "../../helpers";

function DisplayContentType({ Type }) {
    const db = getFirestore(firebase_app);

    const [data, setData] = useState([]);

    async function grabContent() {
        const q = await query(collection(db, "ContentRef"));
        // console.log(q);
        await onSnapshot(q, (querySnapshot) => {
            let itemsArr = [];

            querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
            });
            setData(filterAndOrganize(itemsArr, "Type", Type, "Series"));
        });
    }

    useEffect(() => {
        grabContent();
        // console.log(data);
    }, []);

    // useEffect(() => {
    //     console.log(data);
    // }, [data]);
    return (
        <div
        // style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <h1>All {Type} Pages</h1>
            {/* <div>{JSON.stringify(data)}</div> */}
            <div>
                {data.reverse().map((item, key) => {
                    return (
                        <div key={key}>
                            <h3>Series: {item.series}</h3>
                            {Type === "Book" ? (
                                <div>
                                    {item.contents.map((content, key) => {
                                        const type = Type.replace(" ", "");
                                        const name = content.Name.replace(
                                            " ",
                                            ","
                                        );
                                        // console.log(item);
                                        return (
                                            <ul key={key}>
                                                <li>
                                                    <Link
                                                        to={`/${type}/${content.id}`}
                                                    >
                                                        {content.Name}
                                                    </Link>
                                                </li>
                                            </ul>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    {item.contents
                                        .reverse()
                                        .map((content, key) => {
                                            const type = Type.replace(" ", "");
                                            const name = content.Name.replace(
                                                " ",
                                                ","
                                            );
                                            return (
                                                <ul key={key}>
                                                    <li>
                                                        <Link
                                                            to={`/${type}/${content.id}`}
                                                        >
                                                            {content.Name}
                                                        </Link>
                                                    </li>
                                                </ul>
                                            );
                                        })}
                                </div>
                            )}
                            {/* <h3>Name: {item.Name}</h3> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DisplayContentType;
