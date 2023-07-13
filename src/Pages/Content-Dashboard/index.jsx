import React, { useState, useEffect } from "react";
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
import { Loading } from "../../helpers";

function ContentDashboard() {
  const db = getFirestore(firebase_app);
  const auth = getAuth(firebase_app);
  const router = useNavigate();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const grabContent = async () => {
    const q = await query(collection(db, "content"));
    // console.log(q);
    const content = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
      // console.log(itemsArr);
      setIsLoading(false);
      return () => content();
    });
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
          {items.map((item) => {
            return (
              <Content
                key={item.id}
                id={item.id}
                title={item.title}
                text={item.text}
                admin={false}
              />
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
