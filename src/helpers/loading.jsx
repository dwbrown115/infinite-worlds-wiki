import React from "react";
import { FadeLoader } from "react-spinners";

function Loading(props) {
  const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;
  return (
    <>
      {props.isLoading === false ? (
        <div>{props.component}</div>
      ) : (
        <FadeLoader
          color={"#36D7B7"}
          onLoad={() => props.isLoading}
          css={override}
          size={150}
        />
      )}
    </>
  );
}

export default Loading;
