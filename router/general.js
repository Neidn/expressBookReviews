const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // Add a new user
    // data type is JSON
    const user = req.body;
    const username = user.username;
    const password = user.password;

    if (!isValid(username)) {
        users.push(username);
        res.send("User added successfully");
    } else {
        res.send("User not added");
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // pretty print the json response
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn], null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // author includes blank space like 'Dante Alighieri'
    let author = req.params.author;

    // find the book using author in the books object
    let index = Object.keys(books).find(function (key) {
        return books[key].author == author;
    });

    res.send(JSON.stringify(books[index], null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;

    // find the book using title in the books object
    let index = Object.keys(books).find(function (key) {
        return books[key].title == title;
    });

    res.send(JSON.stringify(books[index], null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let book = books[req.params.isbn];

    res.send(JSON.stringify(book['review'], null, 4));
});


module.exports.general = public_users;
