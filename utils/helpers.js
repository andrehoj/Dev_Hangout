const fetch = require("node-fetch");

async function getRandomPfp(username) {
  try {
    const response = await fetch(`https://robohash.org/${username}`);
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

//checks if the user is logged in, if the user is logging in call next()
function middleWareAuth(req, res, next) {
  if (
    req.originalUrl === "/api/users/login" ||
    req.originalUrl === "/api/users/register"
  ) {
    return next();
  }
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    return next();
  }
}

module.exports = { getRandomPfp, getCurrentTime, middleWareAuth };
