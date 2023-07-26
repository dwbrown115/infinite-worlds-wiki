import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { deletePartOfString } from "../../../../../helpers";

function CharacterSynopsis() {
  const [id, setId] = useState(
    deletePartOfString(window.location.href.split("Character/")[1], "/")
  );

  useEffect(() => {
    setId(deletePartOfString(window.location.href.split("Character/")[1], "/"));
  }, [id]);

  return (
    <>
      <div>
        <Link to={`/Character/${id}`}>Info</Link>
        <Link to={`/Character/${id}/Relationships`}>Relationships</Link>
      </div>
      <div>Character Synopsis</div>
      <div>{id}</div>
      <Link to={`/`}>Back</Link>
    </>
  );
}

export default CharacterSynopsis;
