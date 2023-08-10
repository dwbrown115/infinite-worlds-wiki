import React from "react";

import { DisplayContentType } from "../../../../components";

function BookPages() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <DisplayContentType Type={"Book"} />
        </div>
    );
}

export default BookPages;
