const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const data = JSON.stringify(books, null, 2);
  res.setHeader("Content-Type", "application/json");
  return res.status(200).send(data);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const param = req.params.isbn;
  if (books[param]) {
    const data = JSON.stringify(books, null, 2);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(data);
  } else {
    return res.status(404);
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
  const result = {};

  Object.keys(books).forEach((isbn) => {
    const book = book;
  });
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
