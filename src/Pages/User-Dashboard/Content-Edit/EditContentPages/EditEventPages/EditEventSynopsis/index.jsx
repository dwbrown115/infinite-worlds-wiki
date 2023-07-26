import React from "react";
import { Link } from "react-router-dom";

function EditEventSynopsis() {
  return (
    <>
      <div>Edit Event Synopsis</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditEventSynopsis;
