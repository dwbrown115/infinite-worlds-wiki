// A function that compares two object arrays and returns the differences
function compareObjectArrays(array1, array2, array3) {
  // Create an empty array to store the differences
  let differences = array3;
  // Loop through the first array
  for (let obj1 of array1) {
    // Find the matching object in the second array by comparing the keys and values
    let match = array2.find((obj2) => {
      // Assume the objects have the same number of keys
      let keys = Object.keys(obj1);
      // Check if every key and value in obj1 is equal to the corresponding key and value in obj2
      return keys.every((key) => obj1[key] === obj2[key]);
    });
    // If no match is found, push obj1 to the differences array
    if (!match) {
      differences.push(obj1);
    }
  }
  // Repeat the same process for the second array
  for (let obj2 of array2) {
    let match = array1.find((obj1) => {
      let keys = Object.keys(obj2);
      return keys.every((key) => obj2[key] === obj1[key]);
    });
    if (!match) {
      differences.push(obj2);
    }
  }
  // Return the differences array
  return differences;
}

export default compareObjectArrays;


// function compareArrays(arr1, arr2) {
//         let result = [];
//         let length = Math.max(arr1.length, arr2.length);
//         for (let i = 0; i < length; i++) {
//             if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
//                 result.push(compareArrays(arr1[i], arr2[i]));
//             } else if (JSON.stringify(arr1[i]) === JSON.stringify(arr2[i])) {
//                 result.push(arr1[i]);
//             } else {
//                 result.push(arr2[i]);
//             }
//         }
//         return result;
//     }

// function handleArrayCompare(oldArr, currentarr) {
//         const oldArray = jsonParser(localStorage.getItem(`${id}${oldArr}`));
//         const currentArray = currentarr;
//         const finalArrayContent = [];
//         let finalArray = {};

//         let compareOne = [];
//         let compareTwo = [];
//         let compareThree = [];
//         let compareFour = [];
//         // console.log(oldArray.content);
//         // console.log(currentArray.content);
//         oldArray?.content?.forEach((oldItem) => {
//             compareOne.push({
//                 sectionName: oldItem.sectionName,
//             });
//             compareTwo.push(oldItem.sectionContent);
//         });

//         if (currentArray.content?.length) {
//             currentArray.content?.forEach((currentItem) => {
//                 compareThree.push({ sectionName: currentItem.sectionName });
//                 compareFour.push(currentItem.sectionContent);
//             });
//             const arr1 = compareArrays(compareOne, compareThree);
//             const arr2 = compareArrays(compareTwo, compareFour);
//             // console.log(arr1.length);
//             for (let i = 0; i < arr1.length; i++) {
//                 // console.log(arr1[i].sectionName);
//                 // console.log(arr2[i]);
//                 finalArrayContent.push({
//                     sectionName: arr1[i].sectionName,
//                     sectionContent: arr2[i],
//                 });
//                 finalArray = {
//                     contentType: oldArr,
//                     content: finalArrayContent,
//                 };
//                 localStorage.setItem(`${id}${oldArr}`, finalArray);
//             }
//             // console.log(finalArrayContent);
//             // finalArray = { contentType: oldArr, content: finalArrayContent };
//             // console.log(finalArray);
//             // localStorage.setItem(`${id}${oldArr}`, finalArray);
//         }
//     }

// function compareArrays(arr1, arr2) {
    //     // let isDifferent = false;
    //     // arr1.forEach((item1) => {
    //     //     // console.log(item1);
    //     //     arr2.forEach((item2) => {
    //     //         // console.log(item2);
    //     //         if (item1.sectionName !== item2.sectionName) {
    //     //             // isDifferent = true;
    //     //             console.log("different");
    //     //         } else {
    //     //             console.log("same");
    //     //         }
    //     //     });
    //     // });
    //     // console.log(arr1.length)
    //     // console.log(arr2.length)
    //     let length = arr1.length;
    //     let length2 = arr2.length;
    // }

    // function compareArrays(arr1, arr2) {
    //     let result = [];
    //     let length = Math.max(arr1.length, arr2.length);
    //     for (let i = 0; i < length; i++) {
    //         if (JSON.stringify(arr1[i]) === JSON.stringify(arr2[i])) {
    //             result.push(true);
    //         } else {
    //             result.push(false);
    //         }
    //     }
    //     return result;
    // }