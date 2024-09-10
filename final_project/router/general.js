const express = require('express');
// const axios = require('axios');
const { getBooks } = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users[username]) {
        return res.status(409).json({ message: "Username already exists." });
    }

    users[username] = { password: password };

    res.status(201).json({ message: `User ${username} registered successfully.` });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    //Write your code here
    try {
        const books = await getBooks();  // Fetch books using the function from booksdb.js
        res.status(200).json({
            message: 'List of available books',
            books: books
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching the list of books',
            error: error.message
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const books = await getBooks();  // Fetch books using the function from booksdb.js
        const isbn = req.params.isbn;
        const filtered_book = books[isbn];

        if (filtered_book) {
            res.status(200).json({
                message: `List of available books with isbn: ${isbn}`,
                books: filtered_book,
            });
        } else {
            res.status(500).json({
                message: 'Error fetching the list of books',
                error: error.message
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching the list of books',
            error: error.message
        });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    //Write your code here
    try {
        const books = await getBooks();  // Fetch books using the function from booksdb.js
        const author = req.params.author;

        const filteredBooks = Object.keys(books).reduce((result, bookId) => {
            let book = books[bookId];
            if (book.author.toLowerCase() === author.toLowerCase()) {
                result[bookId] = book;
            }
            return result;
        }, {});

        if (Object.keys(filteredBooks).length > 0) {
            return res.status(200).json({
                message: `List of all books by author: ${author}`,
                books: filteredBooks,
            });
        } else {
            return res.status(300).json({ message: `Error retrieving books by author: ${author}` });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching the list of books',
            error: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    //Write your code here
    try {
        const books = await getBooks();  // Fetch books using the function from booksdb.js
        const title = req.params.title;
        const filteredBooks = Object.keys(books).reduce((result, bookId) => {
            let book = books[bookId];
            if (book.title.toLowerCase() === title.toLowerCase()) {
                result[bookId] = book;
            }
            return result;
        }, {});

        if (Object.keys(filteredBooks).length > 0) {
            return res.status(200).json({
                message: `List of all books by title: ${title}`,
                books: filteredBooks,
            });
        } else {
            return res.status(300).json({ message: `Error retrieving books by title: ${title}` });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching the list of books',
            error: error.message
        });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        const filtered_book = books[isbn];

        if (filtered_book) {
            const reviews = filtered_book.reviews;

            res.status(200).json({
                message: `List of reviews for isbn: ${isbn}`,
                reviews: reviews,
            });
        } else {
            res.status(500).json({
                message: `Error fetching the reviews for isbn: ${isbn}`,
                error: error.message
            });
        }
    } catch (error) {
        res.status(300).json({ message: `Error fetching the reviews for isbn: ${isbn}` });
    }
});

module.exports.general = public_users;
