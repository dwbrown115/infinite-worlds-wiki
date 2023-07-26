import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { deletePartOfString } from "../../../../../helpers";

function CharacterInfo() {
  const [id, setId] = useState(
    deletePartOfString(window.location.href.split("Character/")[1], "/")
  );

  useEffect(() => {
    setId(deletePartOfString(window.location.href.split("Character/")[1], "/"));
  }, [id]);

  return (
    <>
      <div>
        <Link to={`/Character/${id}/Synopsis`}>Synopsis</Link>
        <Link to={`/Character/${id}/Relationships`}>Relationships</Link>
      </div>
      <div>Character Info</div>
      <div>{id}</div>
      <Link to={`/`}>Back to home</Link>
    </>
  );
}

export default CharacterInfo;
