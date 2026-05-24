const validator = require('../helpers/validate');

// Middleware to validate book data before reaching the controller
const saveBook = (req, res, next) => {
  const validationRule = {
    title: 'required|string',
    author: 'required|string',
    genre: 'required|string',
    yearPublished: 'required|numeric',
    summary: 'string',
    editorial: 'string',
    numberOfPages: 'numeric'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }

    next();
  });
};

module.exports = {
  saveBook
};