// I use a try/catch block to protect this function from crashing.
// The try section runs the code that should work normally.
// If something goes wrong, the catch section handles the error
// instead of letting the server break. It's like a safety net
// that keeps the API stable even when an operation fails.

const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

/* ============================================================
   GET ALL BOOKS
   ============================================================ */
const getAllBooks = async (req, res, next) => {
    //#swagger.tags=['Books']
    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .find();

        result.toArray()
            .then((books) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(books);
            })
            .catch((err) => next(err));

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   GET SINGLE BOOK
   ============================================================ */
const getSingleBook = async (req, res, next) => {
    //#swagger.tags=['Books']
    try {
        // I validate the ID format before querying the database.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        const bookId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .find({ _id: bookId });

        result.toArray()
            .then((books) => {
                if (!books[0]) {
                    return res.status(404).json({ message: "Book not found" });
                }

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(books[0]);
            })
            .catch((err) => next(err));

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   CREATE BOOK
   - Validation is handled by middleware before reaching here.
   ============================================================ */
const createBook = async (req, res, next) => {
    //#swagger.tags=['Books']
    try {
        // I build the book object using the validated request body.
        const book = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            yearPublished: req.body.yearPublished,
            summary: req.body.summary,
            editorial: req.body.editorial,
            numberOfPages: req.body.numberOfPages
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .insertOne(book);

        if (response.acknowledged) {
            return res.status(201).json({ id: response.insertedId });
        }

        return res.status(500).json(
            response.error || "Some error occurred while creating the book."
        );

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   UPDATE BOOK
   - ID validation happens here.
   - Body validation happens in middleware.
   ============================================================ */
const updateBook = async (req, res, next) => {
    //#swagger.tags=['Books']
    try {
        // I validate the ID format before updating.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        const bookId = new ObjectId(req.params.id);

        // I build the updated book object using validated data.
        const book = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            yearPublished: req.body.yearPublished,
            summary: req.body.summary,
            editorial: req.body.editorial,
            numberOfPages: req.body.numberOfPages
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .replaceOne({ _id: bookId }, book);

        if (response.modifiedCount > 0) {
            return res.status(204).send();
        }

        return res.status(500).json(
            response.error || "Some error occurred while updating the book."
        );

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   DELETE BOOK
   ============================================================ */
const deleteBook = async (req, res, next) => {
    //#swagger.tags=['Books']
    try {
        // I validate the ID format before deleting.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        const bookId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .deleteOne({ _id: bookId });

        if (response.deletedCount > 0) {
            return res.status(204).send();
        }

        return res.status(500).json(
            response.error || "Some error occurred while deleting the book."
        );

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getAllBooks,
    getSingleBook,
    createBook,
    updateBook,
    deleteBook
};