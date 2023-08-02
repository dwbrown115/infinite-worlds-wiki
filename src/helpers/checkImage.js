export default function checkImage(blob) {
    // console.log(blob);
    // const imageType = blob
    if (blob.type !== undefined) {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => URL.revokeObjectURL(url);
        img.src = url;
        return url;
    }
}
