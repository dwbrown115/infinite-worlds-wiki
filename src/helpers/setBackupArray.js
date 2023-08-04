import { jsonParser } from "./index";
import ArraysBackup from "./ArraysBackup";
import { getData, addData } from "../firebase";

export default async function setBackupArray(id, Array, path) {
    const oldArray = await getData(path, Array);
    const currentArray = await jsonParser(
        localStorage.getItem(`${id}${Array}`)
    );
    const backupPath = `ContentBackup/${id}/${Array}`;
    let finalArray = {};

    let compareOne = [];
    let compareTwo = [];

    oldArray?.content?.forEach((oldItem) => {
        compareOne.push({
            sectionName: oldItem.sectionName,
            sectionContent: oldItem.sectionContent,
        });
    });

    if (currentArray.content?.length) {
        currentArray.content?.forEach((currentItem) => {
            compareTwo.push({
                sectionName: currentItem.sectionName,
                sectionContent: currentItem.sectionContent,
            });
        });
        finalArray = {
            sectionName: Array,
            changedContent: ArraysBackup(compareOne, compareTwo),
        };
    }
    // return finalArray, console.log(finalArray);
    addData(backupPath, finalArray);
}
