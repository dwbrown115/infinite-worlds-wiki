import React from "react";
import { Link } from "react-router-dom";

function EditRaceBlurb() {
  return (
    <>
      <div>Edit Race Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditRaceBlurb;
