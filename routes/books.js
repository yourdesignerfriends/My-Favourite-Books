const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const { saveBook } = require('../middleware/validate');

// GET all books
router.get('/', booksController.getAllBooks);

// GET a single book
router.get('/:id', booksController.getSingleBook);

// POST create a new book (with validation middleware)
router.post('/', saveBook, booksController.createBook);

// PUT update a book (with validation middleware)
router.put('/:id', saveBook, booksController.updateBook);

// DELETE remove a book
router.delete('/:id', booksController.deleteBook);

module.exports = router;