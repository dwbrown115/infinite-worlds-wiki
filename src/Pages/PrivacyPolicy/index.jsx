import React from "react";

function PrivacyPolicy() {
    React.useEffect(() => {
        document.title = "Privacy Policy || Infinite Worlds Wiki";
    }, []);
    return (
        <div>
            <h1>Privacy Policy</h1>
            <ul>
                <li>
                    This website will not collect any personal information from
                    users.
                </li>
                <li>
                    This website will not share any user data with third
                    parties.
                </li>
                <li>
                    This website will not use cookies to track user activity.
                </li>
                <li>
                    This website will not send any emails to users unless they
                    are specifically requested by the user.
                </li>
            </ul>
        </div>
    );
}

export default PrivacyPolicy;
