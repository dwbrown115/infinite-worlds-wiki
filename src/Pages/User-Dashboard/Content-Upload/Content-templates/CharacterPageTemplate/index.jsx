import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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
  const collection = "Characters";
  const router = useNavigate();

  const [manualOfStyle, setManualOfStyle] = useState([]);
  const [blurb, setBlurb] = useState([]);
  const [info, setInfo] = useState([]);
  const [synopsis, setSynopsis] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [character, setCharacter] = useState("");
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
    } else {
      setReset(false);
    }
  }

  async function grabUser() {
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
  }

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

  const handleManualOfStyle = (inputArray) => {
    setManualOfStyle({
      contentType: "CharacterManualofsyle",
      content: inputArray,
    });
    // setManualOfStyle(inputArray);
  };

  const handleBlurb = (inputArray) => {
    setBlurb({
      contentType: "CharacterBlurb",
      content: inputArray,
    });
  };

  const handleInfo = (inputArray) => {
    setInfo({
      contentType: "CharacterInfo",
      content: inputArray,
    });
  };

  const handleSynopsis = (inputArray) => {
    setSynopsis({
      contentType: "CharacterSynopsis",
      content: inputArray,
    });
  };

  const handleRelationships = (inputArray) => {
    setRelationships({
      contentType: "CharacterRelationships",
      content: inputArray,
    });
  };

  async function handleCharacterInfoSubmit() {
    const path = `${collection}/${character.split(" ")}/CharacterInfo/`;
    await replaceImage(
      manualOfStyle,
      "CharacterInfo",
      "ManualOfStyle",
      `${character.split(" ")}`
    );
    // console.log(JSON.parse(JSON.stringify(manualOfStyle)));
    await addData(path, "ManualOfSyle", manualOfStyle);
    await replaceImage(
      blurb,
      "CharacterInfo",
      "Burb",
      `${character.split(" ")}`
    );
    await addData(path, "Blurb", blurb);
    await replaceImage(
      blurb,
      "CharacterInfo",
      "Info",
      `${character.split(" ")}`
    );
    await addData(path, "Info", info);
  }

  async function handleCharacterSynopsisSubmit() {
    const path = `${collection}/${character.split(" ")}/CharacterSynopsis/`;
    await replaceImage(
      synopsis,
      "CharacterSynopsis",
      "Synopsis",
      `${character.split(" ")}`
    );
    await addData(path, "Synopsis", synopsis);
    console.log(synopsis);
  }
  async function handleCharacterRelationshipSubmit() {
    const path = `${collection}/${character.split(" ")}/CharacterRelationship/`;
    await replaceImage(
      relationships,
      "CharacterRelationship",
      "Relationships",
      `${character.split(" ")}`
    );
    await addData(path, "Relationships", relationships);
    console.log(relationships);
  }

  async function handleUpload(e) {
    e.preventDefault();
    const time = Date().toLocaleString();
    const data = {
      characterName: character,
      createdBy: email,
      createdAt: time,
    };

    const docRef = doc(db, "Characters", `${character.split(" ")}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Doc already exists. Please edit intended page insead.");
    } else {
      console.log("doc doesn't exist");
      await setDoc(doc(db, "Characters", `${character.split(" ")}`), data).then(
        async () => {
          await handleCharacterInfoSubmit();
          await handleCharacterSynopsisSubmit();
          await handleCharacterRelationshipSubmit();
          await handleResetConfirm();
          await setCharacter("");
        }
      );
    }
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
        <hr />
        <button type="submit">Submit</button>
      </form>
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
