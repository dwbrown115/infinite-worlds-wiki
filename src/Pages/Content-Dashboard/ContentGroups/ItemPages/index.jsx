import React from "react";

import { DisplayContentType } from "../../../../components";

function ItemPages() {
    React.useEffect(() => {
        document.title = "Items || Infinite Worlds Wiki";
    }, []);
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
