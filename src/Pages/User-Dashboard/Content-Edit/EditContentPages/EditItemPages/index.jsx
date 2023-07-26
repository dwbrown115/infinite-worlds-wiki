import React from "react";
import { Link } from "react-router-dom";

function EditItemPage() {
  return (
    <>
      <div>Edit Item Page</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditItemPage;
