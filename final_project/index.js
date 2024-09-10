const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const JWT_SECRET = '3vFjk!7hPnQ%23nJs8dVhF$9*L!jZ3Aq5#nX!';

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authenication mechanism here
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    if (token != req.session.token) {
        return res.status(401).json({message: 'Invalid token'});
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        // If the token is valid, store the decoded information (e.g., user info) in the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
