import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { firebase_app } from "../../firebase";

function Home() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    return (
        <div
            // style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <h1>Welcome Traveler to the database of The Infinite Worlds</h1>
            <div>
                <p>
                    I have collated all the information I have gathered since
                    leaving Angoril. I Suppose you Travelers would refer to this
                    as a wiki
                </p>
            </div>
        </div>
    );
}

export default Home;
