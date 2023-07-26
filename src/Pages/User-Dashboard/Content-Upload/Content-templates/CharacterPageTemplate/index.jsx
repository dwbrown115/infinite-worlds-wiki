import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components"; 
import { replaceImage } from "../../../../../helpers";
import addData from "../../../../../firebase/firestore/addData";
import firebase_app from "../../../../../firebase/config";

function CharacterPageTemplate() {
  const db = getFirestore(firebase_app);
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;
  const collection = "Characters"
  const router = useNavigate();

  const [manualOfStyle, setManualOfStyle] = useState([]);
  const [blurb, setBlurb] = useState([]);
  const [info, setInfo] = useState([]);
  const [synopsis, setSynopsis] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [character, setCharacter] = useState("uhbhuhbhuhbhuijn");
  const [email, setEmail] = useState("");
  const [reset, setReset] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    // console.log(reset)
    setReset(true);
  }, [reset]);

  function handleResetConfirm() {
    setConfirm(false);
    if (reset == false) {
      setReset(true);
      // console.log(reset);
    } else {
      setReset(false);
      // console.log(reset);
    }
  }

  const grabUser = async () => {
    const collection = "users";
    const userId = auth.currentUser;
    const id = userId.uid;
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    try {
      const data = docSnap.data();
      setEmail(data["email"]);
      // setIsLoading(false);
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

  // useEffect(() => {
  //   console.log(Url)
  // }, [Url])

  const handleManualOfStyle = (inputArray) => {
    // Do something with your array of strings in here
    setManualOfStyle({
      contentType: "CharacterManualofsyle",
      content: inputArray,
    });
    // console.log(arr);
    // setManualOfStyle(inputArray);
  };

  const handleBlurb = (inputArray) => {
    // Do something with your array of strings in here
    setBlurb({
      contentType: "CharacterBlurb",
      content: inputArray,
    });
    // console.log(arr);
    // setBlurb(inputArray);
  };

  const handleInfo = (inputArray) => {
    // Do something with your array of strings in here
    setInfo({
      contentType: "CharacterInfo",
      content: inputArray,
    });
    // console.log(arr);
    setInfo(inputArray);
  };

  const handleSynopsis = (inputArray) => {
    // Do something with your array of strings in here
    setSynopsis({
      contentType: "CharacterSynopsis",
      content: inputArray,
    });
    // console.log(arr);
    setSynopsis(inputArray);
  };

  const handleRelationships = (inputArray) => {
    // Do something with your array of strings in here
    setRelationships({
      contentType: "CharacterRelationships",
      content: inputArray,
    });
    // setRelationships(inputArrayR);
    // console.log(arr);
    setRelationships(inputArray);
  };

  async function handleCharacterInfoSubmit() {
    await replaceImage(manualOfStyle, "characterInfo", "manualOfStyle", character);
    const path = `${collection}/${character}/characterInfo/`
    await addData(path, "manualOfStyle", manualOfStyle)
    await replaceImage(blurb, "characterInfo", "burb", character)
    await addData(path, "blurb", blurb)
    await replaceImage(blurb, "characterInfo", "info", character)
    await addData(path, "info")
      }

  function handleCharacterSynopsisSubmit() {
  }
  function handleCharacterRelationshipSubmit() {
  }

  async function handleUpload(e) {
    e.preventDefault();
    const time = Date().toLocaleString();


    const docRef = doc(db, "Characters", character)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      console.log("doc already exists")
    } else {
      console.log("doc doesn't exist")
    }

    const data = {
      characterName: character,
      createdBy: email,
      createdAt: time,
    }

    // await addData(collection, character, data)
    await setDoc(doc(db, "Characters", character), data).then(async () => {
      await handleCharacterInfoSubmit()
      await handleCharacterSynopsisSubmit()
      await handleCharacterRelationshipSubmit()
    })
    // await handleCharacterInfoSubmit();
    // await handleCharacterSynopsisSubmit();
    // await handleCharacterRelationshipSubmit();
    
    // console.log(allArr);
    // await replaceImage(allArr, character);
    // try {
    //   finalArr = {
    //     contentType: "Character",
    //     character: character,
    //     content: allArr,
    //     createdBy: email,
    //     createdAt: time,
    //   };
    //   console.log(finalArr);
    //   await setDoc(doc(db, "Characters", character), finalArr).then(() => {
    //     handleResetConfirm();
    //   });
    //   // console.log(finalArr).then(() => {
    //   //   handleResetConfirm();
    //   // });
    // } catch (e) {
    //   console.log(e);
    // }
    // await replaceImage(allArr, character);

    // setAllArr([]);
    // await handleResetConfirm();
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
              reset={reset}
            />
          </div>
          <div>
            <h2>Quick Blurb</h2>
            <ContentForm
              handleFormContents={handleBlurb}
              isManualOfStyle={false}
              section={blurb}
              reset={reset}
            />
          </div>
        </div>
        <div>
          <h2>Character Info</h2>
          <ContentForm
            handleFormContents={handleInfo}
            isManualOfStyle={false}
            section={info}
            reset={reset}
          />
        </div>
        {/* <button onClick={handleSubmit}>Submit</button> */}
        <hr />
        <h1>Character Synopsis Page</h1>
        <ContentForm
          handleFormContents={handleSynopsis}
          isManualOfStyle={false}
          section={synopsis}
          reset={reset}
        />
        <h1>Character Relationships Page</h1>
        <ContentForm
          handleFormContents={handleRelationships}
          isManualOfStyle={false}
          section={relationships}
          reset={reset}
        />
        {/* <br /> */}
        <hr />
        <button type="submit">Submit</button>
        {/* <button onClick={handleUpload}>Submit</button> */}
      </form>
      {/* <hr /> */}
      <br />
      <button
        onClick={() => {
          setConfirm(true);
        }}
      >
        Reset
      </button>
      {confirm === true ? (
        <button onClick={handleResetConfirm}>Confirm reset</button>
      ) : (
        <div />
      )}
    </div>
  );
}

export default CharacterPageTemplate;
