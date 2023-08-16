import React from "react";

import { DisplayContentType } from "../../../../components";

function BookPages() {
    React.useEffect(() => {
        document.title = "Books || Infinite Worlds Wiki";
    }, []);
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <DisplayContentType Type={"Book"} />
        </div>
    );
}

export default BookPages;
