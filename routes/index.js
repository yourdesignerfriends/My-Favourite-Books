const router = require('express').Router();

// Swagger documentation route
router.use('/', require('./swagger'));

// Hello World route
router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello World');
});

// Books routes
router.use('/books', require('./books'));

module.exports = router;