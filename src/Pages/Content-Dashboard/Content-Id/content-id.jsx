import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { Loading } from "../../../helpers";
import firebase_app from "../../../firebase/config";

function ContentId() {
    const db = getFirestore(firebase_app);
    const auth = getAuth(firebase_app);
    const dataArray = [];
    const router = useNavigate();

    const [id, setId] = useState(window.location.href.split("content/")[1]);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [imageThere, setImageThere] = useState(false);

    const grabContent = async () => {
        setId(window.location.href.split("content/")[1]);
        const collection = "content";
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("doc exists");
            try {
                const data = docSnap.data();
                dataArray.push(data);
                // console.log(dataArray.some((el) => el.imageUrl));
                setTitle(data["title"]);
                setText(data["text"]);
                setImgUrl(data["imageUrl"]);
                setImageThere(dataArray.some((el) => el.imageUrl));
                // console.log(imageThere);
                setIsLoading(false);
                // console.log(data["imageUrl"]);
                // console.log(title, text);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("no such doc");
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // console.log("user is logged in");
                return router("/user");
            } else {
                router("/");
                return router("/content");
            }
        });
    };

    const handleEditClick = () => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // console.log("user is logged in");
                return router(`/user/edit/${id}`);
            } else {
                console.log("You don't have the authority to edit this");
            }
        });
    };

    useLayoutEffect(() => {
        grabContent();
    }, [id]);

    const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;

    const handlePageContent = () => {
        return (
            <div>
                <br />
                <Link to={`/content/${id}/synopsis`}>Synopsis</Link>
                <Link to={`/content/${id}/relationships`}>Relationships</Link>
                <div>Content</div>
                <div>
                    {/* <div>
            <div>id:</div>
            <div>{id}</div>
          </div> */}
                    <div>
                        <div>Title:</div>
                        <div>{title}</div>
                    </div>
                    <div>
                        <div>Text:</div>
                        <div>{text}</div>
                    </div>
                    {/* <div>
            <div>Image:</div>
            <img
              src={`${imgUrl}`}
              alt="content_id_img.jpg"
              onLoad={() => console.log(imageThere)}
            />
          </div> */}
                    {imageThere === true ? (
                        <div>
                            <div>Image:</div>
                            <img
                                src={`${imgUrl}`}
                                alt="content_id_img.jpg"
                                // onLoad={() => console.log(imgUrl)}
                            />
                        </div>
                    ) : (
                        <br />
                    )}
                    <button onClick={handleEditClick}>Edit</button>
                </div>
                <button onClick={handleClick}>Back to home</button>
                <Link to={"/content"}>Back to content dashboard</Link>
            </div>
        );
    };

    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </>
    );
}

export default ContentId;
