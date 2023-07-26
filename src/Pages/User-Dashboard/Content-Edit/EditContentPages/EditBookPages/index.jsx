import React from "react";
import { Link } from "react-router-dom";

function EditBookPage() {
  return (
    <>
      <div>Edit Book Page</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditBookPage;
