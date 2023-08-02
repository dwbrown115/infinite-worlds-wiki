export default function handleCheckEmptyArray(arr, id, path) {
        if (arr.content?.length) {
            // console.log("not empty");
            localStorage.setItem(`${id}${path}`, JSON.stringify(arr));
        }
    }