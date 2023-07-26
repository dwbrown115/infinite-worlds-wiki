import React from "react";
import { Link } from "react-router-dom";

function EditPowerSystemBlurb() {
  return (
    <>
      <div>Edit Power System Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditPowerSystemBlurb;
