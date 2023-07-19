import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import { replaceImage, checkForImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function CharacterPageTemplate() {
  const db = getFirestore(firebase_app);
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;
  const router = useNavigate();

  const [manualOfStyle, setManualOfStyle] = useState([]);
  const [blurb, setBlurb] = useState([]);
  const [info, setInfo] = useState([]);
  const [synopsis, setSynopsis] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [allInfoArr, setAllInfoArr] = useState([]);
  const [allArr, setAllArr] = useState([]);
  const [character, setCharacter] = useState("hgyi9ihioihb");
  const [email, setEmail] = useState("");

  const grabUser = async () => {
    const collection = "users";
    const userId = auth.currentUser;
    const id = userId.uid;
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    try {
      const data = docSnap.data();
      setEmail(data["email"]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
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

  const handleManualOfStyle = (inputArrayMOS) => {
    // Do something with your array of strings in here
    setManualOfStyle({
      contentType: "CharacterManualofsyle",
      content: inputArrayMOS,
    });
    // console.log(arr);
  };

  const handleBlurb = (inputArrayB) => {
    // Do something with your array of strings in here
    setBlurb({
      contentType: "CharacterBlurb",
      content: inputArrayB,
    });
    // console.log(arr);
  };

  const handleInfo = (inputArrayI) => {
    // Do something with your array of strings in here
    setInfo({
      contentType: "CharacterInfo",
      content: inputArrayI,
    });
    // console.log(arr);
  };

  const handleSynopsis = (inputArrayS) => {
    // Do something with your array of strings in here
    setSynopsis({
      contentType: "CharacterSynopsis",
      content: inputArrayS,
    });
    // console.log(arr);
  };

  const handleRelationships = (inputArrayR) => {
    // Do something with your array of strings in here
    setRelationships({
      contentType: "CharacterRelationships",
      content: inputArrayR,
    });
    // console.log(arr);
  };

  async function handleCharacterInfoSubmit() {
    const allCharInfoArr = [];
    allCharInfoArr.push(...allInfoArr, manualOfStyle, blurb, info);
    allArr.push({
      pageType: "CharacterInfoPage",
      content: allCharInfoArr,
    });
    setManualOfStyle([]);
    setBlurb([]);
    setInfo([]);
    // console.log(allArr.map((item) => console.log(item.PageType)));
  }

  function handleCharacterSynopsisSubmit() {
    const allCharSynopsisArr = [];
    allCharSynopsisArr.push(...allInfoArr, synopsis);
    allArr.push({
      pageType: "CharacterSynopsisPage",
      content: allCharSynopsisArr,
    });
    setSynopsis([]);
    // console.log(allArr);
  }
  function handleCharacterRelationshipSubmit() {
    const allCharRelationshipArr = [];
    allCharRelationshipArr.push(...allInfoArr, relationships);
    allArr.push({
      pageType: "CharacterRelationshipPage",
      content: allCharRelationshipArr,
    });
    setRelationships([]);
    // console.log(allArr);
  }

  function handleUpload() {
    const finalArr = [];
    const time = Date().toLocaleString();
    try {
      finalArr.push(...finalArr, {
        contentType: "Character",
        character: character,
        content: allArr,
        createdBy: email,
        createdAt: time,
      });
      console.log(finalArr);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    await handleCharacterInfoSubmit();
    await handleCharacterSynopsisSubmit();
    await handleCharacterRelationshipSubmit();
    // console.log(allArr);
    if (checkForImage != false) {
      console.log("image exists");
      await replaceImage(allArr, character);
    } else {
      console.log("image doesn't exists");
    }
    // setAllArr([]);
    // awai
  }

  return (
    <div className="CharacterPageTemplate">
      <hr />
      <form id="CharacterForm" onSubmit={handleUpload}>
      <h1>Character Info Page</h1>
      <div>
        <h2>Character Name</h2>
        <input
          type="text"
          placeholder="Character name:"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          required
        />
      </div>
      <div>
        <div>
          <h2>Manual of syle</h2>
          <ContentForm
            handleFormContents={handleManualOfStyle}
            isManualOfStyle={true}
            section={manualOfStyle}
          />
        </div>
        <div>
          <h2>Quick Blurb</h2>
          <ContentForm
            handleFormContents={handleBlurb}
            isManualOfStyle={false}
            section={blurb}
          />
        </div>
      </div>
      <div>
        <h2>Character Info</h2>
        <ContentForm
          handleFormContents={handleInfo}
          isManualOfStyle={false}
          section={info}
        />
      </div>
      {/* <button onClick={handleSubmit}>Submit</button> */}
      <hr />
      <h1>Character Synopsis Page</h1>
      <ContentForm
        handleFormContents={handleSynopsis}
        isManualOfStyle={false}
        section={synopsis}
      />
      <hr />
      <h1>Character Relationships Page</h1>
      <ContentForm
        handleFormContents={handleRelationships}
        isManualOfStyle={false}
        section={relationships}
      />
      <button type="submit">Submit</button>
      {/* <button onClick={handleUpload}>Submit</button> */}
      </form>
      <hr />
    </div>
  );
}

export default CharacterPageTemplate;
