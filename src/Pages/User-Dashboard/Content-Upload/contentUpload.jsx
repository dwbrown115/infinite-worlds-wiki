import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import firebase_app from "../../../firebase/config";

function ContentUpload() {
    const auth = getAuth(firebase_app);
    const user = auth.currentUser;
    const router = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    // console.log("user email is authenticated");
                } else {
                    router("/user/authentication");
                    // console.log("please check your email");
                }
            } else {
                router("/");
            }
        });
    }, [user]);

    const handlePageContent = () => {
        return (
            <>
                <h1>Upload Content Templates</h1>
                <hr />
                <br />
                <Link to={"/user/upload/BookPageTemplate"}>
                    Book Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/CharacterPageTemplate"}>
                    Character Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/EventPageTemplate"}>
                    Event Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/FactionPageTemplate"}>
                    Faction Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/ItemPageTemplate"}>
                    Item Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/LocationPageTemplate"}>
                    Location Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/PowerSystemPageTemplate"}>
                    Power System Page Template
                </Link>
                <br />
                <br />
                <Link to={"/user/upload/RacePageTemplate"}>
                    Race Page Template
                </Link>
                <br />
                <br />
                <hr />
                {/* <button onClick={handleTest}>test</button> */}
                <Link to={"/user"}>Go Back</Link>
            </>
        );
    };

    return <>{handlePageContent()}</>;
}

export default ContentUpload;
