import React from "react";
import { Link } from "react-router-dom";

function EditBookChapters() {
  return (
    <>
      <div>Edit Book Chapters</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditBookChapters;
