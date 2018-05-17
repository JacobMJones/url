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

app.post("/registration", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user_id = generateRandomString();
  // let username = req.body.username;

  var emailInDatabase = containsEmail(email);

  if (email === "" || password === "" || emailInDatabase) {
    res.status(400);
    res.send('None shall pass');
  } else {
    let user = {
      user_id: user_id,
      email: email,
      password: password,
    }


    res.cookie('user_id', user_id);
    users[user_id] = user;

  }
  res.redirect("/urls");
});

//EDIT url
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];


  if (url) {

    urlDatabase[id] = req.body.longURL;
    res.redirect("/urls")
  } else {

    res.redirect("/urls")
  }
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "") {
    res.status(400);
    res.send('email or password string empty');
  }

  console.log(users);
  console.log(containsEmail(email));

  if (containsEmail(email)) {
    for (var userKey in users) {
      if (users[userKey].email === email) {
        if (users[userKey].password === password) {      
          res.cookie('user_id', users[userKey].user_id);
          res.redirect("/urls");
        } else {
          res.send(403, "stop hacking son!")
        }
      }
    }
  } else {
    res.status(400);
    res.send('email or password not listed, maybe register?');
  }
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

  let randomId = generateRandomString();
  let htmlAddress = req.body.longURL;

  urlDatabase[randomId] = htmlAddress;
  res.redirect(`urls/${randomId}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});
app.get("/urls", (req, res) => {

  console.log(req.cookies["user_id"]);
  let templateVars = {
    urls: urlDatabase,
    userObject: users[req.cookies["user_id"]],
  }
  res.render("urls_index", templateVars);
});

// the : denotes a variable will follow
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: req.cookies["user_id"]
  };

  res.render("urls_show", templateVars);
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function containsEmail(email) {
  for (var user in users) {

    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const users = {
  "mrpickl23": {
    user_id: "mrpickl23",
    email: "mrpick123@gmail.com",
    password: "purple-monkey-dinosaur"
  },
  "arosebyanyothername": {
    user_id: "arosebyanyothername",
    email: "rose.Vandermuskin@hotmail.com",
    password: "dishwasher-funk"
  },
  "overunder": {
    user_id: "overunder",
    email: "overunder@yahoo.com",
    password: "tangertanger"
  }
}