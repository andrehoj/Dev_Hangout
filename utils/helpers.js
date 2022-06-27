const fetch = require("node-fetch");

async function getRandomPfp(username) {
  try {
    let response = await fetch(`https://robohash.org/${username}`);
    return response.url;
  } catch (error) {
    return error;
  }
}

module.exports = { getRandomPfp };
