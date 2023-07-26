import React from "react";
import { Link } from "react-router-dom";

function ItemPageTemplate() {
  return (
    <>
      <div>Item Page Template</div>
      <Link to={"/user/upload"}>Go Back</Link>
    </>
  );
}

export default ItemPageTemplate;
