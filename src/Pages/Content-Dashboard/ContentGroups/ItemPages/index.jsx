import React from "react";

import { DisplayContentType } from "../../../../components";

function ItemPages() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Item Pages */}
            <DisplayContentType Type={"Item"} />
        </div>
    );
}

export default ItemPages;
