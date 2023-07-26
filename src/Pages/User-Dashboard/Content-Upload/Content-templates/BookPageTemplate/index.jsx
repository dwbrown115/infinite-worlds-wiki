import React from "react";
import { Link } from "react-router-dom";

function BookPageTemplate() {
  return (
    <>
      <div>Book Page Template</div>
      <Link to={"/user/upload"}>Go Back</Link>
    </>
  );
}

export default BookPageTemplate;
