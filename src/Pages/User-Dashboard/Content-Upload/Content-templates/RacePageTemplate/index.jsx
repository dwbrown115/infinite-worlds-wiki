import React from "react";
import { Link } from "react-router-dom";

function RacePageTemplate() {
  return (
    <>
      <div>Race Page Template</div>
      <Link to={"/user/upload"}>Go Back</Link>
    </>
  );
}

export default RacePageTemplate;
