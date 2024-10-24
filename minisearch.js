const MiniSearch = require("minisearch");
const json = require("./uni.json");

const data = json;

let miniSearch = new MiniSearch({
  fields: ["displayName"],
  storeFields: ["citySlug", "displayName", "country", "uni_id"],
  searchOptions: {
    boost: { displayName: 2 },
    fuzzy: 0,
  },
});

miniSearch.addAll(data);

async function searchCountry(query) {
  try {
    const results = miniSearch.search(query, { fuzzy: 0 });
    // console.log("Search results for:", query);

    if (results.length === 0) {
      console.log("No matches found.");
      return [];
    }
    console.log("Matched data:", results);
    return results;
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}

const searchQuery = "university of london";
searchCountry(searchQuery).then((results) => {
  results.forEach((item) => {
    // console.log(item);
  });
});
