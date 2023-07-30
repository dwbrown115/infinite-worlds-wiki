import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../../helpers";
import { DisplayContent } from "../../../../../components";
import { firebase_app, getData } from "../../../../../firebase";

function CharacterRelationships() {
    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Character/")[1], "/")
    );
    const [relationships, setRelationships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    function handlePageContent() {
        return (
            <div>
                <div>
                    <Link to={`/Character/${id}`}>Info</Link>
                    <Link to={`/Character/${id}/Synopsis`}>Synopsis</Link>
                </div>
                <div>Relationships</div>
                <DisplayContent array={relationships} isManualOfStyle={false} />
                <Link to={`/content`}>Back</Link>
            </div>
        );
    }

    return (
        <>
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </>
    );
}

export default CharacterRelationships;
