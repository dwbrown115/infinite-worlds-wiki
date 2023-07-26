import React from "react";
import { Link } from "react-router-dom";

function EditEventPage() {
  return (
    <>
      <div>Edit Event Page</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditEventPage;
