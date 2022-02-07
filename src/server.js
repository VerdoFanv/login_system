require('dotenv').config();

// packages
const express = require('express');
const useCaseContainer = require('./injections');

const app = express();

app.set('trust proxy', 1);
app.use(
  express.urlencoded({ extended: true }),
  express.json(),
);

// middleware execution
useCaseContainer.forEach((useCase) => {
  useCase.execute(app);
});

// server listener
app.listen(process.env.PORT, `${process.env.HOST}`, () => {
  console.log(`apps berjalan pada https://${process.env.HOST}:${process.env.PORT}`);
});
