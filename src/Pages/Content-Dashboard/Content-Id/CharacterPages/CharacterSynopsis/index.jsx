import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
    Loading,
    deletePartOfString,
    replacePartOfAString,
} from "../../../../../helpers";
import { DisplayContent } from "../../../../../components";
import { getData } from "../../../../../firebase";

function CharacterSynopsis() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Character/")[1], "/")
    );
    const [synopsis, setSynopsis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [hideButton, setHideButton] = useState(true);

    const path = `/Content/Characters/${id}`;

    async function grabContent() {
        const synopsis = await getData(path, "Synopsis");
        if (synopsis) {
            setSynopsis(synopsis);
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
                navigate(`/EditCharacterSynopsis/${id}`);
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
                    <Link to={`/Character/${id}/Relationships`}>
                        Relationships
                    </Link>
                </div>
                <div>
                    <div style={{ display: "flex" }}>
                        <h1>{replacePartOfAString(id, ",", " ")}</h1>
                        <button onClick={handleEdit}>Edit Page</button>
                    </div>
                    <div>{message}</div>
                    {hideButton === false ? (
                        <Link to={"/login"}>Login</Link>
                    ) : (
                        <div />
                    )}
                </div>
                <DisplayContent array={synopsis} isManualOfStyle={false} />
                <Link to={`/Character/${id}`}>Back</Link>
            </div>
        );
    }

    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </>
    );
}

export default CharacterSynopsis;
