import { jsonParser } from "./index";
import ArraysBackup from "./ArraysBackup";
import { getData } from "../firebase";

export default async function setBackupArray(id, Array, path) {
    const oldArray = await getData(path, Array);
    // console.log(oldArray);
    const currentArray = await jsonParser(
        localStorage.getItem(`${id}${Array}`)
    );
    // console.log(currentArray);
    let finalArray = {};

    let compareOne = [];
    let compareTwo = [];

    oldArray?.content?.forEach((oldItem) => {
        compareOne.push({
            sectionName: oldItem.sectionName,
            sectionContent: oldItem.sectionContent,
        });
        // console.log(compareOne);
    });

    if (currentArray.content?.length) {
        currentArray.content?.forEach((currentItem) => {
            compareTwo.push({
                sectionName: currentItem.sectionName,
                sectionContent: currentItem.sectionContent,
            });
            // console.log(compareTwo);
        });
        finalArray = {
            sectionName: Array,
            changedContent: ArraysBackup(compareOne, compareTwo),
        };
        // console.log(finalArray);
    }
    // addData(`/ContentBackup/${id}`, finalArray);
    return finalArray, console.log(finalArray);
    // console.log(finalArray);
}
