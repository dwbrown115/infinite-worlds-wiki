import React from "react";

import { DisplayContentType } from "../../../../components";

function LocationPages() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Location Pages */}
            <DisplayContentType Type={"Location"} />
        </div>
    );
}

export default LocationPages;
