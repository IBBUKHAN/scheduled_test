const FlexSearch = require("flexsearch");

const json = require("./uni.json");

const data = json;

const index = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["displayName", "country"], // Ensure "country" is indexed if required
  },
  tokenize: "forward",
  threshold: 3,
  fuzzy: 2,
});

data.forEach((item) => {
  index.add(item);
});

let searchResults = index.search("Windsor college", { field: "displayName" }); // Search by displayName

console.log(searchResults);

const matchedData = searchResults.map((result) => {
  const match = data.find((item) => item.id === result.id);
  if (match) return match;
  else console.warn("No match found for ID:", result.id);
});

console.log(matchedData);
