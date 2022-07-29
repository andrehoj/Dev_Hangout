const fetch = require("node-fetch");

async function getRandomPfp(username) {
  try {
    let response = await fetch(`https://robohash.org/${username}`);
    return response.url;
  } catch (error) {
    return error;
  }
}

function getCurrentTime() {
  return new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

module.exports = { getRandomPfp, getCurrentTime };
