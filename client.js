const { JSDOM } = require("jsdom");

function hasContent(htmlString) {
  const dom = new JSDOM(htmlString);
  const textContent = dom.window.document.body.textContent || "";
  return textContent.trim().length > 0;
}

// Example usage:
const htmlString1 = "<p></p>\n";
const htmlString2 = "<div>hello<br>bye</div>";

console.log(hasContent(htmlString1)); // false
console.log(hasContent(htmlString2)); // true
