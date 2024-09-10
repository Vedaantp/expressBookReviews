const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = '3vFjk!7hPnQ%23nJs8dVhF$9*L!jZ3Aq5#nX!';
let users = {};

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return users.hasOwnProperty(username);
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    if (isValid(username)) {
        return users[username].password === password;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Validate user credentials
    if (authenticatedUser(username, password)) {
        // Generate JWT token if credentials are valid
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        req.session.token = token;
        req.session.username = username;

        // Return success response with JWT token
        return res.status(200).json({ message: "Login successful!", token });
    } else {
        // Invalid credentials
        return res.status(401).json({ message: "Invalid username or password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn; // Get the ISBN from the request params
    const review = req.body.review; // Get the review from the request body
    const username = req.session.username; // Get the username from the session (mocked in this example)

    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }

    if (!username) {
        return res.status(401).json({ message: "You must be logged in to post a review." });
    }

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if the user has already posted a review for this book
    if (books[isbn].reviews[username]) {
        // If review exists by the user, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully.", reviews: books[isbn].reviews });
    } else {
        // If no review by this user, add a new review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully.", reviews: books[isbn].reviews });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the request params
    const username = req.session.username; // Get the username from the session (mocked in this example)

    if (!username) {
        return res.status(401).json({ message: "You must be logged in to post a review." });
    }

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (books[isbn].reviews.hasOwnProperty(username)) {
        delete books[isbn].reviews[username];
    }

    return res.status(200).json({message: "Review successfully removed."});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
