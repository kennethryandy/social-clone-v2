const functions = require("firebase-functions");
const express = require('express');
const morgan = require('morgan');

// error middlewares
const { notFound, errorHandler } = require('./middlewares/errorHandlers');
// routes
const post = require('./routes/post');
const user = require('./routes/user');

const app = express();
app.use(morgan('common'));

// Post routes
app.use('/post', post);
app.use('/user', user);

// Not found route
app.use(notFound);

// Error routes handler
app.use(errorHandler);

exports.api = functions.region('asia-east2').https.onRequest(app);
