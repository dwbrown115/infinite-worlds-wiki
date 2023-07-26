import React from "react";
import { Link } from "react-router-dom";

function EditItemUses() {
  return (
    <>
      <div>Edit Item Uses</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditItemUses;
