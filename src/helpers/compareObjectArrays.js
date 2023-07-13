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
