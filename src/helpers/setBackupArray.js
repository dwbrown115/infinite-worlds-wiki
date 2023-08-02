import { jsonParser } from "./index";
import ArraysBackup from "./ArraysBackup";
import { getData } from "../firebase";

export default function setBackupArray(id, oldArr, path) {
    // console.log(id)
    // console.log(oldArr)
    // console.log(currentarr)
    const currentArray = jsonParser(localStorage.getItem(`${id}${oldArr}`));

}

    // export default function setBackupArray(id, oldArr, currentarr) {
    //     const oldArray = jsonParser(localStorage.getItem(`${id}${oldArr}`));
    //     const currentArray = currentarr;
    //     const finalArrayContent = [];
    //     let finalArray = {};

    //     let compareOne = [];
    //     let compareTwo = [];
    //     let compareThree = [];
    //     let compareFour = [];
    //     // console.log(oldArray.content);
    //     // console.log(currentArray.content);
    //     oldArray?.content?.forEach((oldItem) => {
    //         compareOne.push({
    //             sectionName: oldItem.sectionName,
    //         });
    //         compareTwo.push(oldItem.sectionContent);
    //     });

    //     if (currentArray.content?.length) {
    //         currentArray.content?.forEach((currentItem) => {
    //             compareThree.push({ sectionName: currentItem.sectionName });
    //             compareFour.push(currentItem.sectionContent);
    //         });
    //         const arr1 = ArraysBackup(compareOne, compareThree);
    //         const arr2 = ArraysBackup(compareTwo, compareFour);
    //         // console.log(arr1.length);
    //         for (let i = 0; i < arr1.length; i++) {
    //             // console.log(arr1[i].sectionName);
    //             // console.log(arr2[i]);
    //             finalArrayContent.push({
    //                 sectionName: arr1[i].sectionName,
    //                 sectionContent: arr2[i],
    //             });
    //             finalArray = {
    //                 contentType: oldArr,
    //                 content: finalArrayContent,
    //             };
    //             // localStorage.setItem(`${id}${oldArr}`, finalArray);
    //             console.log(finalArray);
    //         }
    //     }
    // }