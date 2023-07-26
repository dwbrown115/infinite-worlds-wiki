import React from "react";
import { Link } from "react-router-dom";

function EditPowerSystemInfo() {
  return (
    <>
      <div>Edit Power System Info</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditPowerSystemInfo;
