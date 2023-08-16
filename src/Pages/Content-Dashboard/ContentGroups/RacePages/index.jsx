import React from "react";

import { DisplayContentType } from "../../../../components";

function RacePages() {
    React.useEffect(() => {
        document.title = "Races || Infinite Worlds Wiki";
    }, []);
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            {/* Race Pages */}
            <DisplayContentType Type={"Race"} />
        </div>
    );
}

export default RacePages;
