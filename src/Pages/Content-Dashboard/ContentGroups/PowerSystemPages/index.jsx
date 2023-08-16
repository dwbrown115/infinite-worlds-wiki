import React from "react";

import { DisplayContentType } from "../../../../components";

function PowerSystemPages() {
    React.useEffect(() => {
        document.title = "Power Systems || Infinite Worlds Wiki";
    }, []);
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
