import React from "react";

import { DisplayContentType } from "../../../../components";

function CharacterPagesList() {
    React.useEffect(() => {
        document.title = "Characters || Infinite Worlds Wiki";
    }, []);
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
