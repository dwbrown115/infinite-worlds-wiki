import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ContentForm } from "../../../../../components";
import {
    Loading,
    deletePartOfString,
    replaceImage,
    ProgressBar,
    replacePartOfAString,
} from "../../../../../helpers";
import { firebase_app, getData } from "../../../../../firebase";

function EditBookPage() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("EditBookPage/")[1], "/")
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const path = `/Content/Books/${id}`;

    async function grabUser() {
        const collection = "/users";
        const userId = auth.currentUser;
        const id = userId.uid;
        const userSnap = await getData(collection, id);
        if (userSnap) {
            setEmail(userSnap.email);
        }
    }

    useEffect(() => {
        setId(
            deletePartOfString(
                window.location.href.split("EditBookPage/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    grabUser();
                } else {
                    router("/user/verify");
                }
            } else {
                router("/login");
            }
        });
    }, [user]);

    function handlePageContent() {
        return (
            <div>
                <h1>Edit {replacePartOfAString(id, ",", " ")}</h1>
            </div>
        );
    }
    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
            <Link to={`/Book/${id}`}>Back</Link>
        </>
    );
}

export default EditBookPage;
