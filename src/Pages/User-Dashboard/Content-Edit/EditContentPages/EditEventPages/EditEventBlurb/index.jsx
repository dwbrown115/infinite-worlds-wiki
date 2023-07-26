import React from "react";
import { Link } from "react-router-dom";

function EditEventBlurb() {
  return (
    <>
      <div>Edit Event Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditEventBlurb;
