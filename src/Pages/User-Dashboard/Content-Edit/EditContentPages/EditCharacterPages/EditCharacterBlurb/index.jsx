import React from "react";
import { Link } from "react-router-dom";

function EditCharacterBlurb() {
  return (
    <>
      <div>Edit Character Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditCharacterBlurb;
