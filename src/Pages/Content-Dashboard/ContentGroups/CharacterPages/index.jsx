import React from "react";

import { DisplayContentType } from "../../../../components";

function CharacterPagesList() {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Character Pages */}
            <DisplayContentType Type={"Character"} />
        </div>
    );
}

export default CharacterPagesList;
