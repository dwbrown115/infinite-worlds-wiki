export default function ArraysBackup(arr1, arr2) {
        let result = [];
        let length = Math.max(arr1.length, arr2.length);
        for (let i = 0; i < length; i++) {
            if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
                result.push(ArraysBackup(arr1[i], arr2[i]));
            } else if (JSON.stringify(arr1[i]) === JSON.stringify(arr2[i])) {
                // result.push(true);
                // console.log("same");
                // console.log(arr1[i]);
            } else {
                // result.push(...result, arr1[i], arr2[i]);
                // console.log(arr1[i]);
                result.push({ changedContent: arr1[i], newContent: arr2[i] });
                // console.log(arr1[i]);
                // console.log(arr2[i]);
            }
        }
        return result;
    }