import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { deletePartOfString } from "../../../../helpers";

function ContentSynopsis() {
  const [id, setId] = useState(
    deletePartOfString(window.location.href.split("content/")[1], "/")
  );

  useEffect(() => {
    setId(deletePartOfString(window.location.href.split("content/")[1], "/"));
  }, [id]);
  
  return (
    <>
      <div>Content Synopsis</div>
      <Link to={`/content/${id}`}>Back</Link>
    </>
  );
}

export default ContentSynopsis;
