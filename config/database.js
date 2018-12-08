// Mongodb db configuration

// Here, the mlab db collection url is used but, can be accessed on localhost too.

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb://anirudhmalode:Anirudhmalode@123@ds229373.mlab.com:29373/vidjot-prod"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/vidjot-dev" };
}
