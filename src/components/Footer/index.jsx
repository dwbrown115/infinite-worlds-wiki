import React from "react";
import { Link } from "react-router-dom";

import "./Footer.scss";

function Footer() {
    return (
        <div
            className="Footer"
            // style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Link to="/PrivacyPolicy">Privacy Policy</Link>
            <div>
                <a href="https://discord.gg/SMDsWAMr">Discord</a>
            </div>
            <div>Version Beta 1.1.2</div>
            <div>
                Created and managed by{" "}
                {/* <a href="https://www.silvercastledigital.com/"> */}
                Silver Castle Digital {/* </a> */}
                {/* <div>All rights reserved.</div> */}
            </div>
        </div>
    );
}

export default Footer;
