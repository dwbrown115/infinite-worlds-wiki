import React from "react";
import { Link } from "react-router-dom";

function EditItemDescription() {
  return (
    <>
      <div>Edit Item Description</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditItemDescription;
