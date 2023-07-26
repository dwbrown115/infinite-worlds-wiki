import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { deletePartOfString } from "../../../../../helpers";

function CharacterRelationships() {
  const [id, setId] = useState(
    deletePartOfString(window.location.href.split("Character/")[1], "/")
  );

  useEffect(() => {
    setId(deletePartOfString(window.location.href.split("Character/")[1], "/"));
  }, [id]);

  return (
    <>
      <div>
        <Link to={`/Character/${id}/Synopsis`}>Info</Link>
        <Link to={`/Character/${id}/Synopsis`}>Synopsis</Link>
      </div>
      <div>Character Relationships</div>
      <div>{id}</div>
      <Link to={`/`}>Back to home</Link>
    </>
  );
}

export default CharacterRelationships;
