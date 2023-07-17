import React, { useEffect, useState } from "react";

import { ContentForm } from "../../../../../components";

function CharacterPageTemplate({ doSomethingMethod }) {
  const [manualOfStyle, setManualOfStyle] = useState(null);
  const [blurb, setBlurb] = useState(null);
  const [info, setInfo] = useState(null);
  const [synopsis, setSynopsis] = useState(null);
  const [relationships, setRelationships] = useState(null);
  const [allInfoArr, setAllInfoArr] = useState([]);
  const [allArr, setAllArr] = useState([]);
  const [character, setCharacter] = useState("");

  const handleManualOfStyle = (inputArray) => {
    // Do something with your array of strings in here
    setManualOfStyle({
      contentType: "CharacterManualofsyle",
      content: inputArray,
    });
    // console.log(arr);
  };

  const handleBlurb = (inputArray) => {
    // Do something with your array of strings in here
    setBlurb({
      contentType: "CharacterBlurb",
      content: inputArray,
    });
    // console.log(arr);
  };

  const handleInfo = (inputArray) => {
    // Do something with your array of strings in here
    setInfo({
      contentType: "CharacterInfo",
      content: inputArray,
    });
    // console.log(arr);
  };

  const handleSynopsis = (inputArray) => {
    // Do something with your array of strings in here
    setSynopsis({
      contentType: "CharacterSynopsis",
      content: inputArray,
    });
    // console.log(arr);
  };

  const handleRelationships = (inputArray) => {
    // Do something with your array of strings in here
    setRelationships({
      contentType: "CharacterRelationships",
      content: inputArray,
    });
    // console.log(arr);
  };

  function handleCharacterInfoSubmit() {
    allInfoArr.push(...allInfoArr, manualOfStyle, blurb, info);
    allArr.push(...allArr, {
      PageType: "CharacterInfoPage",
      content: allInfoArr,
    });
    console.log(allArr);
  }

  function handleCharacterSynopsisSubmit() {
    allInfoArr.push(...allInfoArr, synopsis);
    allArr.push(...allArr, {
      PageType: "CharacterSynopsisPage",
      content: allInfoArr,
    });
    console.log(allArr);
  }
  function handleCharacterRelationshipSubmit() {
    allInfoArr.push(...allInfoArr, relationships);
    allArr.push(...allArr, {
      PageType: "CharacterRelationshipPage",
      content: allInfoArr,
    });
    console.log(allArr);
  }
  // useEffect(() => {
  //   doSomethingMethod(manualOfStyle);
  // }, [manualOfStyle]);

  async function handleUpload(e) {
    e.preventDefault();
    const finalArr = [];
    await handleCharacterInfoSubmit();
    await handleCharacterSynopsisSubmit();
    await handleCharacterRelationshipSubmit();
    try {
      finalArr.push(...finalArr, {
        contentType: "Character",
        character: character,
        content: allArr,
      });
      console.log(finalArr);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="CharacterPageTemplate">
      <hr />
      <form onSubmit={handleUpload}>
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
            <ContentForm handleFormContents={handleManualOfStyle} />
          </div>
          <div>
            <h2>Quick Blurb</h2>
            <ContentForm handleFormContents={handleBlurb} />
          </div>
        </div>
        <div>
          <h2>Character Info</h2>
          <ContentForm handleFormContents={handleInfo} />
        </div>
        {/* <button onClick={handleSubmit}>Submit</button> */}
        <hr />
        <h1>Character Synopsis Page</h1>
        <ContentForm handleFormContents={handleSynopsis} />
        <hr />
        <h1>Character Relationships Page</h1>
        <ContentForm handleFormContents={handleRelationships} />
        <button type="submit">Submit</button>
      </form>
      <hr />
    </div>
  );
}

export default CharacterPageTemplate;
