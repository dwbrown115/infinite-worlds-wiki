import React from "react";
import { Link } from "react-router-dom";

function LocationPageTemplate() {
  return (
    <>
      <div>Location Page Template</div>
      <Link to={"/user/upload"}>Go Back</Link>
    </>
  );
}

export default LocationPageTemplate;
