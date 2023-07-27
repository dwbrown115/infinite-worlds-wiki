import { Link } from "react-router-dom";

function EditCharacterSynopsis() {
    return (
        <>
            <div>Edit Character Synopsis</div>
            <Link to={`/user`}>Back</Link>
        </>
    );
}

export default EditCharacterSynopsis;
