export default function checkImage(blob) {
    if (blob.type !== undefined) {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => URL.revokeObjectURL(url);
        img.src = url;
        return url;
    } 
}
