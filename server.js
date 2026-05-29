const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3000;

// Body parser to read JSON
app.use(bodyParser.json());

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    next();
});

app.use('/', require('./routes'));

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