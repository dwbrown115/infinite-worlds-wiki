import React from "react";
import { Link } from "react-router-dom";

function EditBookBlurb() {
  return (
    <>
      <div>Edit Book Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditBookBlurb;
