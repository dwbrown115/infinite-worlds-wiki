import React from "react";

import { DisplayContentType } from "../../../../components";

function PowerSystemPages() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Power System Pages */}
            <DisplayContentType Type={"Power System"} />
        </div>
    );
}

export default PowerSystemPages;
