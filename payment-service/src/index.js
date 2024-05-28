const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const router = require('./routes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', router);

const Startup = async () => {
  try {
    const database = await mongoose.connect(
      'mongodb://concert-mongo-service:27017/payment'
    );
    console.log(
      'connected to mongo payment',
      database.connection.host,
      database.connection.port,
      database.connection.name
    );
  } catch (e) {
    console.log('payment mongo db error', e);
  }
};

app.listen(5002, () => {
  console.log(`payment-service listening on port 5002!!! `);
});

Startup();
