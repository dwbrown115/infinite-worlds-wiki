import React from "react";
import { Link } from "react-router-dom";

function PowerSystemPageTemplate() {
  return (
    <>
      <div>Power System Page Template</div>
      <Link to={"/user/upload"}>Go Back</Link>
    </>
  );
}

export default PowerSystemPageTemplate;
