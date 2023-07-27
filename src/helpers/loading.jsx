import { FadeLoader } from "react-spinners";


// eslint-disable-next-line react/prop-types
function Loading({isLoading, component}) {
    const override = `
        display: block;
        margin: 0 auto;
        border-color: red;
    `;
    return (
        <>
            {isLoading === false ? (
                <div>{component}</div>
            ) : (
                <FadeLoader
                    color={"#36D7B7"}
                    onLoad={() => isLoading}
                    css={override}
                    size={150}
                />
            )}
        </>
    );
}

export default Loading;
