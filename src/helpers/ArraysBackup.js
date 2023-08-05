export default function ArraysBackup(arr1, arr2) {
    let result = [];
    let length = Math.max(arr1.length, arr2.length);
    const time = Date().toLocaleString();
    // console.log(arr1, arr2);

    for (let i = 0; i < length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            result.push(ArraysBackup(arr1[i], arr2[i]));
        } else if (JSON.stringify(arr1[i]) === JSON.stringify(arr2[i])) {
            // result.push(true);
            // console.log("same");
            // console.log(arr1[i]);
        } else {
            // console.log(arr1[i], arr2[i]);

            if (arr2[i].sectionContent.length !== 0) {
                // console.log(arr1[i].sectionContent.length);
                // console.log(arr2[i].sectionContent.length);
                let length = Math.max(
                    arr1[i].sectionContent.length,
                    arr2[i].sectionContent.length
                );
                for (let i2 = 0; i2 < length; i2++) {
                    if (
                        JSON.stringify(arr1[i].sectionContent[i2]) !==
                        JSON.stringify(arr2[i].sectionContent[i2])
                    ) {
                        let sectionChanges = {
                            sectionName: arr1[i].sectionName,
                        };
                        if (
                            JSON.stringify(arr1[i].sectionName) !==
                            JSON.stringify(arr2[i].sectionName)
                        ) {
                            sectionChanges = {
                                ...sectionChanges,
                                newSectionName: arr2[i].sectionName,
                            };
                        }
                        if (
                            arr1[i].sectionContent[i2] &&
                            !arr2[i].sectionContent[i2]
                        ) {
                            sectionChanges = {
                                ...sectionChanges,
                                deletedContent: [arr1[i].sectionContent[i2]],
                                timeModified: time,
                            };
                        } else {
                            if (arr1[i].sectionContent[i2]) {
                                // console.log(arr1[i].sectionContent[i2]);
                                sectionChanges = {
                                    ...sectionChanges,
                                    currentContent: [
                                        arr1[i].sectionContent[i2],
                                    ],
                                };
                            }
                            if (arr2[i].sectionContent[i2]) {
                                // console.log(arr2[i].sectionContent[i2]);
                                sectionChanges = {
                                    ...sectionChanges,
                                    newContent: [arr2[i].sectionContent[i2]],
                                };
                            }
                            sectionChanges = {
                                ...sectionChanges,
                                timeModified: time,
                            };
                        }
                        // console.log(sectionChanges);
                        result.push(sectionChanges);
                    }
                }
            }
            if (
                JSON.stringify(
                    arr1[i].sectionName !== JSON.stringify(arr2[i].sectionName)
                )
            ) {
                // console.log(arr1[i].sectionName, arr2[i].sectionName);
                result.push({
                    sectionName: arr1[i].sectionName,
                    newSectionName: arr2[i].sectionName,
                    timeModified: time,
                });
            }
        }
    }
    return result;
}
