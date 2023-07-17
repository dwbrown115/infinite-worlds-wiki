import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { deletePartOfString } from "../../../../helpers";
function ContentRelationships() {
  const [id, setId] = useState(
    deletePartOfString(window.location.href.split("content/")[1], "/")
  );

  useEffect(() => {
    setId(deletePartOfString(window.location.href.split("content/")[1], "/"));
  }, [id]);

  return (
    <>
      <div>Content Relationships</div>
      <Link to={`/content/${id}`}>Back</Link>
    </>
  );
}

export default ContentRelationships;
