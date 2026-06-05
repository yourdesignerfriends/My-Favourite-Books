const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/authenticate');

const booksController = require('../controllers/books');
const { saveBook } = require('../middleware/validate');

// GET all books
router.get('/', booksController.getAllBooks);

// GET a single book
router.get('/:id', booksController.getSingleBook);

// POST create a new book (with validation middleware)
router.post('/', isAuthenticated, saveBook, booksController.createBook);

// PUT update a book (with validation middleware)
router.put('/:id', isAuthenticated, saveBook, booksController.updateBook);

// DELETE remove a book
router.delete('/:id', isAuthenticated, booksController.deleteBook);

module.exports = router;