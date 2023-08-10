function groupBy(array, key) {
    return array.reduce((result, obj) => {
        const value = obj[key];
        (result[value] = result[value] || []).push(obj);
        return result;
    }, {});
}

export default function filterAndOrganize(array, itemName, itemValue, key) {
    let filteredArray = array.filter((obj) => obj.Type === itemName);
    let separateArray = array.filter((obj) => obj.Type === itemValue);
    let arr = filteredArray.concat(separateArray);
    // console.log(arr);
    const groups = groupBy(arr, key);
    const mappedGroups = Object.keys(groups).map((key) => {
        return {
            series: key,
            contents: groups[key],
        };
    });
    return mappedGroups;
}
