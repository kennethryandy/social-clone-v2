const functions = require("firebase-functions");
const express = require('express');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorHandlers');

const app = express();
app.use(morgan('common'));




// Not found route
app.use(notFound);

// Error routes handler
app.use(errorHandler);

exports.api = functions.region('asia-east2').https.onRequest(app);
