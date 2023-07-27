import { Link } from "react-router-dom";

function EditLocationPage() {
    return (
        <>
            <div>Edit Location Page</div>
            <Link to={`/user`}>Back</Link>
        </>
    );
}

export default EditLocationPage;
