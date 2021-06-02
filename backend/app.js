const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const pagesRouter = require('./routes/pages');
const usersRouter = require('./routes/users');

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE'
  );
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/pages', pagesRouter);
app.use('/users', usersRouter);

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, errCode: status, data: data });
});

// ---- CHECKING SERVER STATUS ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`**** SERVER STARTED AT PORT ${PORT} ****`);
});

module.exports = app;

// ----- CHECKING IF CONNECTED WITH DATABASE OR CATCH & DISPLAY ERRORS ----
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(`**** SOMETHING WENT WRONG **** `);
  console.log(`**** UNABLE TO CONNECT WITH DATABASE ****`);
  console.log(`\n ${err}`);
});

db.once('open', () => {
  console.log('**** CONNECTED WITH DATABASE SUCCESSFULLY ****');
});
