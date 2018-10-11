const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars"); // express-handlebars for handling templates,views 3rd p. plugin
const methodOverride = require("method-override"); // form submission/actions after editing
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser"); // 3rd p. plugin to catch the submited data
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// passport config
require("./config/passport")(passport);

// DB config
const db = require("./config/database");

// Map global promise - get rid of warning
mongoose.promise = global.promise;

// connect to mongoose
mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
      // useMongoClient: true
    }
  )
  // following promises works same as callback.
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// // How middleware works?
// app.use((req, res, next) => {
//   req.name = "Anirudh Malode"; // Now can be called at any stage
//   next(); // If not given > page reloads forever
// });

// Handlebars middleware >>>>>>>>> from express-handlebars github doccumentation
app.engine("handlebars", exphbs({ defaultLayout: "main" })); // The layout is "main">> so have to create it.
app.set("view engine", "handlebars");

// body-parser middleware >>>>>>> from bodyparser github
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Method over-ride middleware
app.use(methodOverride("_method"));

// express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Index Route(Index page) >> using req(request) & res(response) as arguments
app.get("/", (req, res) => {
  const title = "Hello Welcome to the Index!";
  //   res.send(req.name); // on the screen
  res.render("index", {
    title: title
  }); // o/p given in index.handlebars
});

// About Route(About page) >> same as above
app.get("/about", (req, res) => {
  res.render("about"); // o/p given in about.handlebars
});

// use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 5000; //port no. that we want.
app.listen(port, () => {
  console.log(`Server started on port no.: ${port}`);
});
