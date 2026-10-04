const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username already exists in the users array
  let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  // Check if username and password match records
  let matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
};

// Task 8: Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in. Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      username: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    };
    return res.status(200).json({ message: "Customer successfully logged in", token: accessToken });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 9: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review || req.body.review;
  const username = (req.session && req.session.authorization) ? req.session.authorization.username : (req.user ? req.user.username : null);

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `The review for the book with ISBN ${isbn} has been added/updated.`,
    reviews: books[isbn].reviews
  });
});

// Task 10: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = (req.session && req.session.authorization) ? req.session.authorization.username : (req.user ? req.user.username : null);

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`
    });
  } else {
    return res.status(404).json({ message: `No review found for ISBN ${isbn} posted by the user ${username}.` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

