const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  res.setHeader("Content-Type", "application/json");
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
    req.session.authrization = {
      accessToken: token,
      username,
    };

    return res.status(200).json({ message: "Login succesful", token: token });
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;

  const username = req.session.authrization?.username;

  if (!username) {
    return res
      .status(401)
      .json({ error: "User not authenticated. Please login first." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (!review || review.trim() === "") {
    return res.status(400).json({ error: "Review content is required" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn].title,
    review: review,
    reviews: books[isbn].reviews,
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authrization?.username;

  if (!username) {
    return res
      .status(401)
      .json({ error: "User not authenticated. Please login first." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ error: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbn].title,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
