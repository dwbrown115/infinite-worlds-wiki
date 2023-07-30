export default function SortObjects(arr, keywords) {
    arr.sort((a, b) => {
        let i = 0;
        while (i < keywords.length) {
            if (a[keywords[i]] < b[keywords[i]]) {
                return -1;
            }
            if (a[keywords[i]] > b[keywords[i]]) {
                return 1;
            }
            i++;
        }
        return 0;
    });
    return arr;
}
