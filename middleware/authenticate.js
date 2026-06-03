// I use this middleware to protect routes that require authentication.
// If the user is not logged in (meaning the session does not contain a user),
// I return a 401 Unauthorized response. Otherwise, I allow the request to continue.
const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You do not have access.");
    }
    next();
};

module.exports = {
    isAuthenticated
};