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

// ==============================================================================
// Task 1 & Task 10: Get all books using Promise callbacks or async-await with Axios
// ==============================================================================

// Task 10: Get the list of books available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 10 with Axios: Function to retrieve all books using async/await with Axios
const getAllBooksAsync = async (url = BASE_URL) => {
  try {
    const response = await axios.get(`${url}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 10 with Axios: Function to retrieve all books using Promise callbacks with Axios
const getAllBooksPromise = (url = BASE_URL) => {
  return axios.get(`${url}/`)
    .then(response => response.data)
    .catch(error => { throw error; });
};

// ==============================================================================
// Task 2 & Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
// ==============================================================================

// Task 11: Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });

  getBook
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 11 with Axios: Function to search book details by ISBN using Promise callbacks with Axios
const getBookByISBNPromise = (isbn, url = BASE_URL) => {
  return axios.get(`${url}/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => { throw error; });
};

// Task 11 with Axios: Function to search book details by ISBN using async/await with Axios
const getBookByISBNAsync = async (isbn, url = BASE_URL) => {
  try {
    const response = await axios.get(`${url}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==============================================================================
// Task 3 & Task 12: Get book details based on author using Promise callbacks or async-await with Axios
// ==============================================================================

// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = [];
      for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
          matchingBooks.push({ isbn, ...books[isbn] });
        }
      }
      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject({ status: 404, message: `No books found for author "${req.params.author}"` });
    });

    const result = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 12 with Axios: Function to search books by author using async/await with Axios
const getBooksByAuthorAsync = async (author, url = BASE_URL) => {
  try {
    const response = await axios.get(`${url}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 12 with Axios: Function to search books by author using Promise callbacks with Axios
const getBooksByAuthorPromise = (author, url = BASE_URL) => {
  return axios.get(`${url}/author/${encodeURIComponent(author)}`)
    .then(response => response.data)
    .catch(error => { throw error; });
};

// ==============================================================================
// Task 4 & Task 13: Get all books based on title using Promise callbacks or async-await with Axios
// ==============================================================================

// Task 13: Get all books based on title using Promise callbacks with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
    if (matchingBooks.length > 0) resolve(matchingBooks);
    else reject({ status: 404, message: `No books found with title "${req.params.title}"` });
  });

  getBooksByTitle
    .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 13 with Axios: Function to search books by title using Promise callbacks with Axios
const getBooksByTitlePromise = (title, url = BASE_URL) => {
  return axios.get(`${url}/title/${encodeURIComponent(title)}`)
    .then(response => response.data)
    .catch(error => { throw error; });
};

// Task 13 with Axios: Function to search books by title using async/await with Axios
const getBooksByTitleAsync = async (title, url = BASE_URL) => {
  try {
    const response = await axios.get(`${url}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getAllBooksPromise = getAllBooksPromise;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByAuthorPromise = getBooksByAuthorPromise;
module.exports.getBooksByTitlePromise = getBooksByTitlePromise;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;


