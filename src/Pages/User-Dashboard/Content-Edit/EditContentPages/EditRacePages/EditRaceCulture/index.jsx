import React from "react";
import { Link } from "react-router-dom";

function EditRaceCulture() {
  return (
    <>
      <div>Edit Race Culture</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditRaceCulture;
