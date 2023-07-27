import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import firebase_app from "../../firebase/config";

function Content(
    edits,
    id,
    Id,
    admin,
    originalId,
    edit,
    time,
    search,
    title,
    text
) {
    const auth = getAuth(firebase_app);
    const router = useNavigate();
    const sanitizer = DOMPurify.sanitize;

    const handleEditClick = () => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // console.log("user is logged in");
                return router(`/user/edit/${id}`);
            } else {
                console.log("You don't have the authority to edit this");
            }
        });
    };

    return (
        <>
            <br />
            {admin === true ? (
                <div>
                    <div>
                        <div>id:</div>
                        <div>{Id}</div>
                    </div>
                    <div>
                        <div>Title:</div>
                        <div>{originalId}</div>
                    </div>
                    <br />
                    <div>
                        <div>Title edit:</div>
                        {edits.map((item, key) => {
                            return (
                                <div key={key}>
                                    {item.title != null ? (
                                        <ul>
                                            <li>
                                                <div>{item.title}</div>
                                            </li>
                                        </ul>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <div>Text edit:</div>
                        {edits.map((item, key) => {
                            return (
                                <div key={key}>
                                    {item.text != null ? (
                                        <ul>
                                            <li>
                                                <div>{item.text}</div>
                                            </li>
                                        </ul>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <div>Image url edit:</div>
                        {edits.map((item, key) => {
                            return (
                                <div key={key}>
                                    {item.imageUrl != null ? (
                                        <ul>
                                            <li>
                                                <a href={item.imageUrl}>
                                                    {item.imageUrl}
                                                </a>
                                            </li>
                                        </ul>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <br />
                    <div>
                        <div>Edited by:</div>
                        <div>{edit}</div>
                    </div>
                    <div>
                        <div>Edited on:</div>
                        <div>{time}</div>
                    </div>
                </div>
            ) : (
                <div>
                    {search !== true ? (
                        <div>
                            <div>
                                <div>Title:</div>
                                <Link to={`/content/${id}`}>{title}</Link>
                            </div>
                            <br />
                            <button onClick={handleEditClick}>Edit</button>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <div>Title:</div>
                                <Link to={`/content/${id}`}>{title}</Link>
                            </div>
                            <div>
                                <div>Text:</div>
                                {/* <div>{text}</div> */}
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizer(text),
                                    }}
                                ></p>
                            </div>
                            <br />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Content;
