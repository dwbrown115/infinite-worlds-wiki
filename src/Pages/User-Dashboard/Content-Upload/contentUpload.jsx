import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// import firebase_app from "../../firebase/config";
// import addData from "../../firebase/firestore/addData";
// import makeid from "../../helpers/randomString";
import { Loading } from "../../../helpers";
import firebase_app from "../../../firebase/config";
import addData from "../../../firebase/firestore/addData";
import makeid from "../../../helpers/randomString";
import CharacterPageTemplate from "./Content-templates/CharacterPageTemplate";

function ContentUpload() {
  const db = getFirestore(firebase_app);
  const auth = getAuth(firebase_app);
  const storage = getStorage(firebase_app);
  // const collection = "content";
  const user = auth.currentUser;
  const router = useNavigate();

  const [collection, setCollection] = useState("content");
  const [id, setId] = useState(makeid(32));
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [characterArr, setCharacterArr] = useState([]);

  const doSomething = (inputArray) => {
    setCharacterArr(inputArray);
  };

  const grabUser = async () => {
    const collection = "users";
    const userId = auth.currentUser;
    const id = userId.uid;
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    try {
      const data = docSnap.data();
      setUserName(data["userName"]);
      setEmail(data["email"]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpload = async (data) => {
    try {
      await addData(collection, `${title.split(" ")}`, data);
      setIsLoading(true);
      console.log("successful");
      setIsLoading(false);
      document.getElementById("contentForm").reset();
      setTitle("");
      setText("");
      setImage("");
      setImageUrl(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleImageUpload = async () => {
    const contentRef = ref(
      storage,
      `/${collection}/${image.name}+${makeid(16)}`
    );
    console.log(image);
    // await uploadBytes(contentRef, image);
    // if (image != "") {
    //   await uploadBytes(contentRef, image).then((snapshot) => {
    //     getDownloadURL(snapshot.ref).then(async (url) => {
    //       const imageUrl = url;
    //       const time = Date().toLocaleString();
    //       const data = {
    //         title: title,
    //         text,
    //         imageUrl,
    //         createdBy: editedBy,
    //         createdAt: time,
    //       };
    //       handleUpload(data);
    //     });
    //   });
    // } else {
    //   const time = Date().toLocaleString();
    //   const data = {
    //     title: title,
    //     text,
    //     createdBy: editedBy,
    //     createdAt: time,
    //   };
    //   handleUpload(data);
    // }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const docRef = doc(db, collection, title);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("doc already exists");
      // router(`/content/${title}`);
    } else {
      // console.log("doc doesn't exist");
      handleImageUpload();
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        if (user.emailVerified) {
          grabUser();
          // console.log("user email is authenticated");
        } else {
          router("/user/authentication");
          // console.log("please check your email");
        }
      } else {
        router("/");
      }
    });
  }, [user]);

  const handleReset = () => {
    document.getElementById("contentForm").reset();
    setTitle("");
    setText("");
    setImage("");
    setImageUrl(null);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(URL.createObjectURL(event.target.files[0]));
        setImage(event.target.files[0]);
        // console.log(image);
        // console.log(URL.createObjectURL(event.target.files[0]));
      };
      reader.readAsDataURL(event.target.files[0]);
      // // setImage(event.target.files[0]);
      // console.log(event.target.files[0]);
    }
  };

  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      // Use FileReader to convert the image file to a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setImage(e.target.files[0]);
        // console.log(image);
        // console.log(URL.createObjectURL(e.target.files[0]));
      };
      reader.readAsDataURL(e.target.files[0]);
      // console.log(reader.readAsDataURL(e.target.files[0]))
    }
  };

  function handleTest() {
    console.log(characterArr);
  }

  const handlePageContent = () => {
    return (
      <>
      <h1>Upload Content Templates</h1>
      <hr />
        <br />
        <Link to={"/user/upload/BookPageTemplate"}>Book Page Template</Link>
        <br />
        <br />
        <Link to={"/user/upload/CharacterPageTemplate"}>
          Character Page Template
        </Link>
        <br />
        <br />
        <Link to={"/user/upload/EventPageTemplate"}>Event Page Template</Link>
        <br />
        <br />
        <Link to={"/user/upload/ItemPageTemplate"}>Item Page Template</Link>
        <br />
        <br />
        <Link to={"/user/upload/LocationPageTemplate"}>
          Location Page Template
        </Link>
        <br />
        <br />
        <Link to={"/user/upload/PowerSystemPageTemplate"}>
          Power System Page Template

        </Link>
        <br />
        <br />
        <Link to={"/user/upload/RacePageTemplate"}>Race Page Template</Link>
        <br />
        <br />
        <hr />
        {/* <button onClick={handleTest}>test</button> */}
        <Link to={"/user"}>Go Back</Link>
      </>
    );
  };

  return (
    <>
      {/* <Loading isLoading={isLoading} component={handlePageContent()} /> */}
      {handlePageContent()}
    </>
  );
}

export default ContentUpload;

{
  /* <label>
  Image:
  <img src={imageUrl} />
  <br />
  <input type="file" name="myImage" accept="image/*" onChange={onImageChange} />
</label>; */
}
