import React from "react";
import { Link } from "react-router-dom";

function EditCharacterRelationships() {
  return (
    <>
      <div>Edit Character Relationships</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditCharacterRelationships;
