import React from "react";
import { Link } from "react-router-dom";

function EditLocationBlurb() {
  return (
    <>
      <div>Edit Location Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditLocationBlurb;
