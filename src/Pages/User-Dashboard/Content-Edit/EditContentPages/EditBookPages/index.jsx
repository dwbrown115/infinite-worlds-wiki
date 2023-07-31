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
    jsonParser,
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
    const [synopsis, setSynopsis] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [edited, setEdited] = useState(false);
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

    async function grabContent() {
        // const manualOfStyle = await getData(path, "ManualOfStyle");
        // console.log(manualOfStyle);
    }

    useEffect(() => {
        setIsLoading(true);
        // setId(
        //     deletePartOfString(
        //         window.location.href.split("EditBookPage/")[1],
        //         "/"
        //     )
        // );
        // console.log(id);
        grabContent();
        // console.log(localStorage.getItem(`${id}Edited`));
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`${id}Edited`, true);
        localStorage.setItem(
            `${id}ManualOfStyle`,
            JSON.stringify(manualOfStyle)
        );
        // console.log(edited);
    }, [edited, manualOfStyle]);

    function handleManualOfStyleEdit(inputArray) {
        setEdited(true);
        setManualOfStyle({
            contentType: "ManualOfStyle",
            content: inputArray,
        });
        // console.log(manualOfStyle);
    }

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

    function test() {
        // localStorage.clear();
        // grabEdit();
        // console.log(localStorage.getItem(`${id}Edited`));
        console.log(jsonParser(localStorage.getItem(`${id}ManualOfStyle`)));
        // setEdited(true);
        // setEdited(false);
        // if (edited == true) {
        //     setEdited(false);
        // } else {
        //     setEdited(true);
        // }
    }

    function handlePageContent() {
        return (
            <div>
                <button onClick={test}>Test</button>
                <h1>Edit {replacePartOfAString(id, ",", " ")}</h1>
                <div>
                    <h2>Edit Manual of Style</h2>
                    <ContentForm
                        handleFormContents={handleManualOfStyleEdit}
                        isManualOfStyle={true}
                        section={"ManualOfStyle"}
                        reset={confirm}
                        edited={`${id}Edited`}
                        path={path}
                        contentName={id}
                    />
                </div>
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
