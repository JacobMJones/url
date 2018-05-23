var express = require("express");
var cookieSession = require('cookie-session');
var app = express();
const bcrypt = require('bcrypt');
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(cookieSession({
  name: 'session',
  keys: ["carsanddogs"],
}))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/urls/new", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect('/home')
    return;
  }
  let usersUrls = buildAccessibleUrlObject(users[req.session.user_id].user_id);
  let templateVars = {
    urls: usersUrls,
    currentUser: users[req.session.user_id],
  }
  res.render("urls_new", templateVars);
});

app.post("/registration", (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  let user_id = generateRandomString();
  var emailInDatabase = containsEmail(email);
console.log("**** ")

  if (email === "") {
    res.status(400);
    res.send('Please include an email address');
  } else if (password === "") {
    res.status(400);
    res.send('Please include a password');
  } else if (emailInDatabase ===  true) {
    res.status(400);
    res.send('Email already registered');
  } else {
    let user = {
      user_id: user_id,
      email: email,
      password: bcrypt.hashSync(password, 10)
    }

    users[user_id] = user;
    req.session.user_id = users[user_id].user_id;
  }
  res.redirect("/urls");
});

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
  //one function to check both parameters would be nice
  if (containsEmail(email)) {
    for (var userKey in users) {
      if (users[userKey].email === email) {
        if (bcrypt.compareSync(password, users[userKey].password)) {
          req.session.user_id = users[userKey].user_id;
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

  let longURL = req.body.longURL;
  let shortURL = req.body.shortURL;

  if (urlDatabase[shortURL]) {
    urlDatabase[shortURL] = {
      longURL: longURL,
      owner: req.session.user_id
    }
  } else {
    let randomId = generateRandomString();
    urlDatabase[randomId] = {
      longURL: longURL,
      owner: req.session.user_id
    };
  }
  res.redirect('/urls');

});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {

  if (!users[req.session.user_id]) {
    res.redirect('/home')
    return;
  }

  let usersUrls = buildAccessibleUrlObject(users[req.session.user_id].user_id);
  let templateVars = {
    urls: usersUrls,
    currentUser: users[req.session.user_id],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
  }
  if (Object.keys(usersUrls).length > 0) {
    res.render("urls_index", templateVars);
  } else {
    res.render("urls_new", templateVars);
  }
});


app.get("/urls/:id", (req, res) => {

  if (!urlDatabase[req.params.id]) {
    res.redirect('/home');
    return;
  } else {
    let shortURL = req.params.id;
    let longURL = urlDatabase[shortURL].longURL;

    let templateVars = {
      shortURL: shortURL,
      longURL: longURL,
      user_id: req.session["user_id"],
      currentUser: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  }
});

app.listen(PORT, () => {

});


function buildAccessibleUrlObject(userID) {

  userUrlDatabase = {};
  for (var urlID in urlDatabase) {
    if (urlDatabase[urlID].owner === userID) {
      userUrlDatabase[urlID] = urlDatabase[urlID].longURL;
    }
  }
  return userUrlDatabase;
}

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

}

var urlDatabase = {

};