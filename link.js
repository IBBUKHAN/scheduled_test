const convertTextUrlsToAnchorTags = (text) => {
  const urlRegex =
    /(\b(https?:\/\/|www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/\S*)?\b)/gi;

  return text.replace(urlRegex, (match) => {
    const url = /^https?:\/\//i.test(match) ? match : `http://${match}`;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

// Usage example
const inputText = "Check out google.com and https://openai.com for more info!";
const formattedText = convertTextUrlsToAnchorTags(inputText);

console.log(formattedText);
