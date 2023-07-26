import React from "react";
import { Link } from "react-router-dom";

function EditRaceHistory() {
  return (
    <>
      <div>Edit Race History</div>
      <Link to={`/user`}>Back</Link>
    </>
  );
}

export default EditRaceHistory;
