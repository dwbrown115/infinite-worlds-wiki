import React from "react";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import firebase_app from "../../firebase/config";

function Content(props) {
  const auth = getAuth(firebase_app);
  const router = useNavigate();
  const sanitizer = DOMPurify.sanitize;
  const edits = props.edits;

  const handleEditClick = () => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // console.log("user is logged in");
        return router(`/user/edit/${props.id}`);
      } else {
        console.log("You don't have the authority to edit this");
      }
    });
  };

  return (
    <>
      <br />
      {props.admin === true ? (
        <div>
          <div>
            <div>id:</div>
            <div>{props.Id}</div>
          </div>
          <div>
            <div>Title:</div>
            <div>{props.originalId}</div>
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
                        <a href={item.imageUrl}>{item.imageUrl}</a>
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
            <div>{props.edit}</div>
          </div>
          <div>
            <div>Edited on:</div>
            <div>{props.time}</div>
          </div>
        </div>
      ) : (
        <div>
          {props.search !== true ? (
            <div>
              <div>
                <div>Title:</div>
                <Link to={`/content/${props.id}`}>{props.title}</Link>
              </div>
              {/* <div>
            <div>Text:</div>
            <div>{props.text}</div>
          </div> */}
              <br />
              <button onClick={handleEditClick}>Edit</button>
            </div>
          ) : (
            <div>
              <div>
                <div>Title:</div>
                <Link to={`/content/${props.id}`}>{props.title}</Link>
              </div>
              <div>
                <div>Text:</div>
                {/* <div>{props.text}</div> */}
                <p
                  dangerouslySetInnerHTML={{ __html: sanitizer(props.text) }}
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
