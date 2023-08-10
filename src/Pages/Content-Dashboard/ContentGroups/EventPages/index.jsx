import React from "react";

import { DisplayContentType } from "../../../../components";

function EventPages() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Event Pages */}
            <DisplayContentType Type={"Event"} />
        </div>
    );
}

export default EventPages;
