var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "1s32xK": "http://www.yahoo.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/registration", (req, res) => {
 res.render("registration");
});


//EDIT url
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];
  console.log('in edit', id, url);

  if (url) {
    console.log('in change url');
    urlDatabase[id] = req.body.longURL;
    res.redirect("/urls")
  } else {
    console.log('NOT in change url');
    res.redirect("/urls")
  }
});

app.post("/login", (req, res) => {
  var userName = req.body.username;

  res.cookie("username", userName);
  res.redirect("/urls");


});

app.post("/urls/:id/delete", (req, res) => {
  const idToDelete = req.params.id;
  const urlToDelete = urlDatabase[idToDelete];

  if (urlToDelete) {
    delete urlDatabase[idToDelete];

  }
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let randomId = generateRandomString();
  let htmlAddress = req.body.longURL;

  urlDatabase[randomId] = htmlAddress;
  res.redirect(`urls/${randomId}`);
});


//delete Employee.firstname;



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/logout", (req, res) => {
res.clearCookie("username");
res.redirect('/urls');
});
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  }
  res.render("urls_index", templateVars);
});

// the : denotes a variable will follow
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  //shortUrl is the variable name the ejs page will use
  //req.params.id is the value of the shortUrl variable/key
  res.render("urls_show", templateVars);
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/login", (req, res) => {
  var username = req.body.username;

  res.cookie("username", username);
  res.redirect("/urls");

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  console.log(text);
  return text;
};

const users = { 
  "Pickle": {
    id: "mrpickl23", 
    email: "mrpick123@gmail.com", 
    password: "purple-monkey-dinosaur"
  },
 "Rose Vandermuskin": {
    id: "arosebyanyothername", 
    email: "rose.Vandermuskin@hotmail.com", 
    password: "dishwasher-funk"
  }
  "Tanger Erotts": {
    id: "overunder", 
    email: "overunder@yahoo.com", 
    password: "tangertanger"
  }
}