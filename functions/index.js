const functions = require("firebase-functions");
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));


exports.api = functions.region('asia-east2').https.onRequest(app);
