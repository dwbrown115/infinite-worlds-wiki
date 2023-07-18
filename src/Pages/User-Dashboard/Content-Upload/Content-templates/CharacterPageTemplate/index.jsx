import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ContentForm } from "../../../../../components";

function CharacterPageTemplate({ doSomethingMethod }) {
  const [manualOfStyle, setManualOfStyle] = useState([]);
  const [blurb, setBlurb] = useState([]);
  const [info, setInfo] = useState([]);
  const [synopsis, setSynopsis] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [allInfoArr, setAllInfoArr] = useState([]);
  const [allArr, setAllArr] = useState([]);
  const [character, setCharacter] = useState("hgyi9ihioihb");

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
  function replaceImage(array) {
    array.map((item) => {
      {
        item.content.map((item) => {
          // console.log(item)
          {
            item.content.map((item) => {
              console.log(item.sectionImage);
            });
          }
        });
      }
    });
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
    // console.log(allArr);
    console.log(replaceImage(allArr));
    // setAllArr([]);
    // await
    // try {
    //   finalArr.push(...finalArr, {
    //     contentType: "Character",
    //     character: character,
    //     content: allArr,
    //   });
    //   console.log(finalArr);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  return (
    <div className="CharacterPageTemplate">
      <hr />
      {/* <form onSubmit={handleUpload}> */}
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
      {/* <button type="submit">Submit</button> */}
      <button onClick={handleUpload}>Submit</button>
      {/* </form> */}
      <hr />
    </div>
  );
}

export default CharacterPageTemplate;
