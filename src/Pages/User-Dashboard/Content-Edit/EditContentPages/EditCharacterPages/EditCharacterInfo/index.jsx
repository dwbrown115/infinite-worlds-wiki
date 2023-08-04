import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";

import { ContentForm } from "../../../../../../components";
import {
    Loading,
    deletePartOfString,
    replaceImage,
    ProgressBar,
    replacePartOfAString,
    handleCheckEmptyArray,
    setBackupArray,
} from "../../../../../../helpers";
import {
    addData,
    firebase_app,
    getData,
    updateData,
} from "../../../../../../firebase";

function EditCharacterInfo() {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const user = auth.currentUser;

    const [id, setId] = useState(
        deletePartOfString(
            window.location.href.split("EditCharacterInfo/")[1],
            "/"
        )
    );
    const [email, setEmail] = useState("");
    const [manualOfStyle, setManualOfStyle] = useState([]);
    const [blurb, setBlurb] = useState([])
    const [info, setInfo] = useState([]);
    const [powersAndAbilities, setPowersAndAbilities] = useState([]);
    const [reset, setReset] = useState(false);
    return (
        <>
            <div>Edit Character Info</div>
            <Link to={`/user`}>Back</Link>
        </>
    );
}

export default EditCharacterInfo;
