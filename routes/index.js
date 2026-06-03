const router = require('express').Router();
const passport = require('passport');

// Swagger documentation route
router.use('/', require('./swagger'));

// Books routes
router.use('/books', require('./books'));

// Authors routes
router.use('/authors', require('./authors'));

// I create a login route that starts the GitHub authentication process.
// When the user visits /login, Passport redirects them to GitHub.
router.get('/login', passport.authenticate('github'), (req, res) => {});

// I create a logout route so the user can end their session.
// Passport clears the session and I redirect them back to the home page.
// router.get('/logout', function (req, res, next) {
//     req.logout(function (err) {
//         if (err) { return next(err);}
//         res.redirect('/');
//     });
// });
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

module.exports = router;