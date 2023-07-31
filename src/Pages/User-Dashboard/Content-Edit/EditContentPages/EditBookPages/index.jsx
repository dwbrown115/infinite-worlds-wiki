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

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("EditBookPage/")[1], "/")
    );
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [synopsis, setSynopsis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const path = `/Content/Books/${id}`;

    useEffect(() => {
        setId(
            deletePartOfString(
                window.location.href.split("EditBookPage/")[1],
                "/"
            )
        );
        setIsLoading(false);
    }, [id]);

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
            <Link to={`/user`}>Back</Link>
        </>
    );
}

export default EditBookPage;
