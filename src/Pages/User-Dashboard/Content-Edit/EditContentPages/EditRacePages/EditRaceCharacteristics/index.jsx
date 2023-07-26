import React from "react";
import { Link } from "react-router-dom";

function EditRaceCharacteristics() {
  return (
    <>
      <div>Edit Race Characteristics</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditRaceCharacteristics;
