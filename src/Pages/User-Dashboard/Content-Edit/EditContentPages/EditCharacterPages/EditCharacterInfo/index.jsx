import { Link } from "react-router-dom";

function EditCharacterInfo() {
    return (
        <>
            <div>Edit Character Info</div>
            <Link to={`/user`}>Back</Link>
        </>
    );
}

export default EditCharacterInfo;
