import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { Loading, deletePartOfString } from "../../../../../helpers";
import { DisplayContent } from "../../../../../components";
import { getData } from "../../../../../firebase";

function CharacterSynopsis() {
    const [id, setId] = useState(
        deletePartOfString(window.location.href.split("Character/")[1], "/")
    );
    const [synopsis, setSynopsis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    function handlePageContent() {
        return (
            <div>
                <div>
                    <Link to={`/Character/${id}`}>Info</Link>
                    <Link to={`/Character/${id}/Relationships`}>
                        Relationships
                    </Link>
                </div>
                <div>Synopsis</div>
                <DisplayContent array={synopsis} isManualOfStyle={false} />
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

export default CharacterSynopsis;
