const express = require('express');
const router = express.Router();
// I import my authentication middleware.
const { isAuthenticated } = require('../middleware/authenticate');

const authorsController = require('../controllers/authors');
const { saveAuthor } = require('../middleware/validateAuthors');

// GET all authors public route
router.get('/', authorsController.getAllAuthors);

// GET a single author public route
router.get('/:id', authorsController.getSingleAuthor);

// POST create a new author (with validation middleware) protected route
router.post('/', isAuthenticated, saveAuthor, authorsController.createAuthor);

// PUT update an author (with validation middleware) protected route
router.put('/:id', isAuthenticated, saveAuthor, authorsController.updateAuthor);

// DELETE remove an author protected route
router.delete('/:id', isAuthenticated,authorsController.deleteAuthor);

module.exports = router;