import React from "react";

import { DisplayContentType } from "../../../../components";

function FactionPages() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Faction Pages */}
            <DisplayContentType Type={"Faction"} />
        </div>
    );
}

export default FactionPages;
