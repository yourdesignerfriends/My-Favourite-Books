const validator = require('../helpers/validate');

// I use this middleware to validate author data before it reaches the controller.
const saveAuthor = (req, res, next) => {
    const validationRule = {
        fullName: 'required|string',
        birthPlace: 'required|string',
        birthYear: 'required|numeric',
        birthMonth: 'required|string',
        religion: 'string',
        writingStyle: 'required|string',
        notableWorks: 'string'
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
    saveAuthor
};