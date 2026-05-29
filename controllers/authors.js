// I use a try/catch block to protect this function from crashing.
// The try section runs the code that should work normally.
// If something goes wrong, the catch section handles the error
// instead of letting the server break. It's like a safety net
// that keeps the API stable even when an operation fails.

const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

/* ============================================================
   GET ALL AUTHORS
   ============================================================ */
const getAllAuthors = async (req, res, next) => {
    //#swagger.tags=['Authors']
    try {
        // I connect to the database and access the 'authors' collection.
        // Here I use .find() without filters because I want to retrieve
        // every author stored in the collection.
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .find();

        const authors = await result.toArray();

        // I return all authors with status 200.
        res.status(200).json(authors);

    } catch (err) {
        // I pass any unexpected server error to the global 500 handler.
        next(err);
    }
};

/* ============================================================
   GET SINGLE AUTHOR
   ============================================================ */
const getSingleAuthor = async (req, res, next) => {
    //#swagger.tags=['Authors']
    try {
        // I validate the ID format before querying the database.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid author ID format" });
        }

        const authorId = new ObjectId(req.params.id);

        // I query the database for a single author using the validated ID.
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .findOne({ _id: authorId });

        // If no author is found, I return a 404 Not Found.
        if (!result) {
            return res.status(404).json({ message: "Author not found" });
        }

        // I return the found author with status 200.
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
};

/* ============================================================
   CREATE AUTHOR
   - Validation is handled by middleware before reaching here.
   ============================================================ */
const createAuthor = async (req, res, next) => {
    //#swagger.tags=['Authors']
    try {
        // I build the author object using the validated request body.
        const author = {
            fullName: req.body.fullName,
            birthPlace: req.body.birthPlace,
            birthYear: req.body.birthYear,
            birthMonth: req.body.birthMonth,
            religion: req.body.religion,
            writingStyle: req.body.writingStyle,
            notableWorks: req.body.notableWorks
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .insertOne(author);

        // If the insert was successful, I return the new ID with status 201.
        if (response.acknowledged) {
            return res.status(201).json({ id: response.insertedId });
        }

        // If something unexpected happens, I return a 500 error.
        return res.status(500).json(
            response.error || "Some error occurred while creating the author."
        );

    } catch (err) {
        next(err);
    }
};

/* ============================================================
   UPDATE AUTHOR
   - ID validation happens here.
   - Body validation happens in middleware.
   ============================================================ */
const updateAuthor = async (req, res, next) => {
    //#swagger.tags=['Authors']
    try {
        // I validate the ID format before updating.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid author ID format" });
        }

        const authorId = new ObjectId(req.params.id);

        // I build the updated author object using validated data.
        const author = {
            fullName: req.body.fullName,
            birthPlace: req.body.birthPlace,
            birthYear: req.body.birthYear,
            birthMonth: req.body.birthMonth,
            religion: req.body.religion,
            writingStyle: req.body.writingStyle,
            notableWorks: req.body.notableWorks
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .replaceOne({ _id: authorId }, author);

        // If no document matched, the author does not exist. I return a 404.
        if (response.matchedCount === 0) {
            return res.status(404).json({ message: "Author not found" });
        }

        // If the author was updated successfully, I return a 204.
        return res.status(204).send();

    } catch (err) {
        next(err);
    }
};

/* ============================================================
   DELETE AUTHOR
   ============================================================ */
const deleteAuthor = async (req, res, next) => {
    //#swagger.tags=['Authors']
    try {
        // I validate the ID format before deleting.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid author ID format" });
        }

        const authorId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('authors')
            .deleteOne({ _id: authorId });

        // If deletedCount is 0, the author does not exist. I return a 404.
        if (response.deletedCount === 0) {
            return res.status(404).json({ message: "Author not found" });
        }

        // If the author was deleted successfully, I return a 204.
        return res.status(204).send();

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllAuthors,
    getSingleAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor
};