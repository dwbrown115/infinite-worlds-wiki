import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
    Loading,
    deletePartOfString,
    replacePartOfAString,
} from "../../../../../helpers";
import { DisplayContent } from "../../../../../components";
import { firebase_app, getData } from "../../../../../firebase";

function CharacterRelationships() {
    const auth = getAuth(firebase_app);
    const navigate = useNavigate();

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Character/")[1], "/")
    );
    const [relationships, setRelationships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [hideButton, setHideButton] = useState(true);

    const path = `/Content/Characters/${id}`;

    async function grabContent() {
        const relationships = await getData(path, "Relationships");
        if (relationships) {
            setRelationships(relationships);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        setId(
            deletePartOfString(window.location.href.split("Character/")[1], "/")
        );
        grabContent();
    }, [id]);

    function handleEdit() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate(`/EditCharacterRelationships/${id}`);
            } else {
                setMessage("You must be logged in to edit this content.");
                setHideButton(false);
            }
        });
    }

    function handlePageContent() {
        return (
            <div>
                <div>
                    <Link to={`/Character/${id}`}>Info</Link>
                    <Link to={`/Character/${id}/Synopsis`}>Synopsis</Link>
                </div>
                <div>
                    <button onClick={handleEdit}>Edit Page</button>
                </div>
                <div>
                    <div style={{ display: "flex" }}>
                        <h1>{replacePartOfAString(id, ",", " ")}</h1>
                    </div>
                    <div>{message}</div>
                    {hideButton === false ? (
                        <Link to={"/login"}>Login</Link>
                    ) : (
                        <div />
                    )}
                </div>
                <DisplayContent array={relationships} isManualOfStyle={false} />
                <Link to={`/Character/${id}`}>Back</Link>
            </div>
        );
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </div>
    );
}

export default CharacterRelationships;
