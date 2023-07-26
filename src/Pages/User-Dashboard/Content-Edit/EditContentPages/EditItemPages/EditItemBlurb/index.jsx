import React from "react";
import { Link } from "react-router-dom";

function EditItemBlurb() {
  return (
    <>
      <div>Edit Item Blurb</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditItemBlurb;
