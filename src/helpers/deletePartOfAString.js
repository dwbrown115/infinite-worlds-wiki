function deletePartOfString(str, symbol) {
  // Check if the symbol is a valid string and not empty
  if (typeof symbol === "string" && symbol.length > 0) {
    // Use the indexOf method to find the first occurrence of the symbol in the string
    let index = str.indexOf(symbol);
    // If the symbol is found, use the slice method to get the substring before the symbol
    if (index !== -1) {
      let result = str.slice(0, index);
      // Return the result
      return result;
    } else {
      // Return the original string if the symbol is not found
      return str;
    }
  } else {
    // Return the original string if the symbol is invalid
    return str;
  }
}

export default deletePartOfString