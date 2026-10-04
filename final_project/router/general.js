const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Task 2 & Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ status: 500, message: "Error retrieving books" });
    }
  });

  getBooks
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 3 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBook
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});
  
// Task 4 & Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const matchingBooks = [];
    const isbns = Object.keys(books);
    for (let isbn of isbns) {
      if (books[isbn].author.toLowerCase() === author) {
        matchingBooks.push({ isbn: isbn, ...books[isbn] });
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found for author" });
    }
  });

  getBooksByAuthor
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 5 & Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const getBooksByTitle = new Promise((resolve, reject) => {
    const matchingBooks = [];
    const isbns = Object.keys(books);
    for (let isbn of isbns) {
      if (books[isbn].title.toLowerCase() === title) {
        matchingBooks.push({ isbn: isbn, ...books[isbn] });
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found with title" });
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ==============================================================================
// Task 10 - Task 13 / Coursera Task 11: Implementation using Axios with async/await and Promises
// ==============================================================================

/**
 * Task 10: Retrieve all books using async/await with Axios
 */
const getAllBooksAsync = async (url = BASE_URL) => {
  try {
    const response = await axios.get(`${url}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all books:", error.message);
    throw error;
  }
};

/**
 * Task 11: Search book details by ISBN using Promises with Axios
 */
const getBookByISBNPromise = (isbn, url = BASE_URL) => {
  return axios.get(`${url}/isbn/${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching book by ISBN ${isbn}:`, error.message);
      throw error;
    });
};

/**
 * Task 12: Search book details by Author using Promises with Axios
 */
const getBooksByAuthorPromise = (author, url = BASE_URL) => {
  return axios.get(`${url}/author/${encodeURIComponent(author)}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching books by author ${author}:`, error.message);
      throw error;
    });
};

/**
 * Task 13: Search book details by Title using async/await with Axios
 */
const getBooksByTitleAsync = async (title, url = BASE_URL) => {
  try {
    const response = await axios.get(`${url}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by title ${title}:`, error.message);
    throw error;
  }
};

// Async route endpoints using Axios helpers
public_users.get('/async/books', async (req, res) => {
  try {
    const data = await getAllBooksAsync();
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

public_users.get('/async/isbn/:isbn', (req, res) => {
  getBookByISBNPromise(req.params.isbn)
    .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(500).json({ message: err.message }));
});

public_users.get('/async/author/:author', (req, res) => {
  getBooksByAuthorPromise(req.params.author)
    .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(500).json({ message: err.message }));
});

public_users.get('/async/title/:title', async (req, res) => {
  try {
    const data = await getBooksByTitleAsync(req.params.title);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBooksByAuthorPromise = getBooksByAuthorPromise;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;

