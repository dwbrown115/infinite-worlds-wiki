export default function searchAndBold(string, word, before, after) {
  // Check if the input is valid
  if (
    typeof string !== "string" ||
    typeof word !== "string" ||
    typeof before !== "number" ||
    typeof after !== "number"
  ) {
    return "Invalid input";
  }

  // Convert the string and the word to lower case if the input is not case sensitive
  let lowerString = string.toLowerCase();
  let lowerWord = word.toLowerCase();

  // Split the string into an array of words
  let words = lowerString.split(" ");

  // Find the index of the first word that contains the word to look for
  let index = words.findIndex((w) => w.includes(lowerWord));

  // If no match is found, return an empty string
  if (index === -1) {
    return "";
  }

  // Calculate the start and end indices of the slice of words to return
  let start = Math.max(0, index - before);
  let end = Math.min(words.length, index + after + 1);

  // Slice the array of words and join them with spaces
  let result = words.slice(start, end).join(" ");

  // Replace the matching word or words with bold tags
  let regex = new RegExp(lowerWord, "g");
  result = result.replace(regex, `<b>${lowerWord}</b>`);

  // Return the result
  return result;
}
