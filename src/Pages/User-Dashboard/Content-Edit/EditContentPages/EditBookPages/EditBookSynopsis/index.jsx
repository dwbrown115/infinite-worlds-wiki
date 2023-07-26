import React from "react";
import { Link } from "react-router-dom";

function EditBookSynopsis() {
  return (
    <>
      <div>Edit Book Synopsis</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditBookSynopsis;
