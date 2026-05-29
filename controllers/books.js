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
        // I connect to the database and access the 'books' collection.
        // Here I use .find() without filters because I want to retrieve
        // every book stored in the collection.
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .find();

            const books = await result.toArray();

            // I return all books with status 200.
            res.status(200).json(books);

    } catch (err) {
        // I pass any unexpected server error to the global 500 handler.
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

        // I query the database for a single book using the validated ID.
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('books')
            .findOne({ _id: bookId });

            // If no book is found, I return a 404 Not Found.
            if (!result) {
                return res.status(404).json({ message: "Book not found" });
            }
            // I return the found book with status 200.  
            res.status(200).json(result);

    } catch (err) {
        // I pass unexpected errors to the global 500 handler.
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

        // If no document matched, the book does not exist → 404
        if (response.matchedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // If the book was updated successfully → 204
        if (response.modifiedCount > 0) {
            return res.status(204).send();
        }

        // If matched but not modified (same data), still OK → 204
        return res.status(204).send();

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

        // I check how many documents were deleted.
        // If deletedCount is 0, it means the book does not exist, so I return a 404.
        if (response.deletedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (response.deletedCount > 0) {
            return res.status(204).send();
        }

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