require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();

// Body parser to read JSON
app.use(bodyParser.json());

// Sessions
// I initialize express-session so I can store user information between requests.
// Passport needs this session to keep the user logged in after GitHub authentication.
// In production, I would replace the secret with a secure random value.
// app.use(session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
// }));
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: "none"
    }
}));

// Passport
// I initialize Passport on every request so it can handle authentication.
// This also connects Passport to the session I configured above.
app.use(passport.initialize());
app.use(passport.session());

// GitHub Strategy
// I configure the GitHub strategy for Passport so my application knows
// how to authenticate users through GitHub. I pass my client ID, client secret,
// and the callback URL stored in my environment variables.
// When GitHub sends back the authenticated user, I simply return the profile
// so Passport can store it in the session.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(null, profile);
    //});
}));

// I tell Passport how to serialize the user into the session.
// This allows Passport to store only the necessary user information.
passport.serializeUser((user, done) => {
    done(null, user);
});

// I tell Passport how to deserialize the user from the session.
// This lets Passport rebuild the user object on every request.
passport.deserializeUser((user, done) => {
    done(null, user);
});

// CORS
// I also enable CORS using the library to ensure all HTTP methods are allowed.
// This helps avoid issues whenx testing different endpoints or using Swagger UI.
app.use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
app.use(cors({ origin: "*" }))


// I manually set these CORS headers to make sure my API can be accessed
// from Swagger, Postman, or any frontend without running into CORS issues.
// This gives me full control over which methods and headers are allowed.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, PATCH, OPTIONS, DELETE"
    );
    next();
})
// LOGGER GLOBAL
app.use((req, res, next) => {
    next();
});

app.use("/", require("./routes/index.js"));

// I create a simple home route so I can quickly check whether the user
// is logged in or not. If the session contains a user, I display their name.
// Otherwise, I show a "Logged Out" message.
app.get('/', (req, res) => { 
    res.send(
        req.session.user !== undefined
        ? `Logged in as ${req.session.user.displayName}`
        : "Logged Out"
    ); 
});

// Callback GitHub
// This is the callback route GitHub redirects to after authentication.
// If authentication fails, I redirect the user to my API docs.
// If it succeeds, I store the GitHub user in the session and redirect home.
app.get(
    '/github/callback', passport.authenticate('github', { 
        failureRedirect: '/api-docs'}),
        (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

/* *******************************
 * Intentional Error Route
 ******************************* */
app.get('/error', (_req, _res, next) => {
    // I intentionally throw an error to demonstrate how my global error handler works.
    next(new Error("Intentional server crash for testing purposes"));
});

/* *******************************
 * File Not Found Route (404)
 ******************************* */
app.use((_req, _res, next) => {
    next({ status: 404, message: "Sorry, we couldn't find that page." });
});

// I use this global error handler to catch any errors passed with next(err)
// so the API always returns a clean and consistent JSON response.
// This handler automatically returns a 500 Internal Server Error in the following cases:
// - If I don't define err.status, Express defaults to 500.
// - If MongoDB fails during a database operation.
// - If any internal logic in my controller throws an unexpected error.
// - If an unexpected exception occurs anywhere in the request pipeline.
// - If I call next(err) without specifying a status code.
// I need to declare these parameters _req and _next because Express requires them, even though I don't use them directly.
app.use((err, _req, res, _next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {
            console.log(`Database is listening and node Running on port ${port}`)
        });
    }
});