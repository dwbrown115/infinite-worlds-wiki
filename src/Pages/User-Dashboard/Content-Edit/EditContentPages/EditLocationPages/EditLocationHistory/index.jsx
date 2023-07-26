import React from "react";
import { Link } from "react-router-dom";

function EditLocationHistory() {
  return (
    <>
      <div>Edit Location History</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditLocationHistory;
