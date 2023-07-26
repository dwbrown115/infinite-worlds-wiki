import React from 'react'
import { Link } from "react-router-dom";

function EventPageTemplate() {
    return (
      <>
        <div>Event Page Template</div>
        <Link to={"/user/upload"}>Go Back</Link>
      </>
    );
}

export default EventPageTemplate
