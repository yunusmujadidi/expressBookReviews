const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password!" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exist!" });
  }
  users.push({
    username,
    password,
  });
  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const data = JSON.stringify(books, null, 2);
  res.setHeader("Content-Type", "application/json");
  return res.status(200).send(data);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const data = JSON.stringify(books[isbn], null, 2);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(data);
  } else {
    return res.status(404).json({ message: `Books with ${isbn} is not found` });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorReq = req.params.author;
  const result = [];

  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (book.author === authorReq) {
      result.push({ isbn, ...book });
    }
  });

  if (result.length > 0) {
    return res.status(200).send(result);
  } else {
    return res
      .status(404)
      .json({ message: `Books with author ${authorReq} not found` });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleReq = req.params.title;
  const result = [];

  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (titleReq.toLowerCase() === book.title.toLowerCase()) {
      result.push({ isbn, ...book });
    }
  });

  if (result.length > 0) {
    return res.status(200).send(result);
  } else {
    return res
      .status(404)
      .json({ message: `Books with title ${titleReq} is not found` });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.setHeader("Content-Type", "application/json");

  if (book && book.reviews) {
    return res.status(200).send(book.reviews);
  } else {
    return res
      .status(404)
      .json({ message: `Books review with ${isbn} is not found` });
  }
});

// Get all books using async-await
public_users.get("/async", async function (req, res) {
  try {
    const getAllBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const booksList = await getAllBooks();
    const data = JSON.stringify(booksList, null, 2);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

public_users.get("/async/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error(`Book with ISBN ${isbn} not found`));
        }
      });
    };

    const book = await getBookByISBN(isbn);
    const data = JSON.stringify(book, null, 2);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

public_users.get("/async/author/:author", async function (req, res) {
  try {
    const authorReq = req.params.author;

    const getBooksByAuthor = (author) => {
      return new Promise((resolve) => {
        const result = [];
        Object.keys(books).forEach((isbn) => {
          const book = books[isbn];
          if (book.author === author) {
            result.push({ isbn, ...book });
          }
        });
        resolve(result);
      });
    };

    const result = await getBooksByAuthor(authorReq);

    if (result.length > 0) {
      return res.status(200).send(result);
    } else {
      return res
        .status(404)
        .json({ message: `Books with author ${authorReq} not found` });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

public_users.get("/async/title/:title", async function (req, res) {
  try {
    const titleReq = req.params.title;

    const getBooksByTitle = (title) => {
      return new Promise((resolve) => {
        const result = [];
        Object.keys(books).forEach((isbn) => {
          const book = books[isbn];
          if (title.toLowerCase() === book.title.toLowerCase()) {
            result.push({ isbn, ...book });
          }
        });
        resolve(result);
      });
    };

    const result = await getBooksByTitle(titleReq);

    if (result.length > 0) {
      return res.status(200).send(result);
    } else {
      return res
        .status(404)
        .json({ message: `Books with title ${titleReq} is not found` });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports.general = public_users;
