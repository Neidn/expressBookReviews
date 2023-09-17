const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.includes(username);
}

const authenticatedUser = (username, password) => { //returns boolean
    if (isValid(username)) {
        return users[username] === password;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    if (authenticatedUser(req.body.username, req.body.password)) {
        let token = jwt.sign({username: req.body.username}, "fingerprint_customer", {expiresIn: "1h"});
        res.status(200).json({token: "login successful", jwt: token});
    } else {
        res.status(401).json({message: "Invalid credentials"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;

    // review from query string
    let newReview = req.query.review;

    if (books[isbn]) {
        let reviews = books[isbn].reviews;

        // Add the new review to the reviews object
        reviews[new Date().toISOString()] = newReview;


        books[isbn].reviews = reviews;

        res.send("Review added successfully to " + isbn + " book");
    } else {
        res.send("Review not added");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
        let isbn = req.params.isbn;

        if (books[isbn]) {
            books[isbn].reviews = {};


            res.send("Review deleted successfully from " + isbn + " book");
        } else {
            res.send("Review not deleted");
        }
    }
);

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
