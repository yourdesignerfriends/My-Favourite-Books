const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authors');
const { saveAuthor } = require('../middleware/validateAuthors');

// GET all authors
router.get('/', authorsController.getAllAuthors);

// GET a single author
router.get('/:id', authorsController.getSingleAuthor);

// POST create a new author (with validation middleware)
router.post('/', saveAuthor, authorsController.createAuthor);

// PUT update an author (with validation middleware)
router.put('/:id', saveAuthor, authorsController.updateAuthor);

// DELETE remove an author
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;