const express = require('express');
const mongoose = require('mongoose');

const router = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', router);

const Startup = async () => {
  try {
    const database = await mongoose.connect(
      'mongodb://concert-mongo-service:27017/reservation'
    );
    console.log(
      'connected to mongo reservation',
      database.connection.host,
      database.connection.port,
      database.connection.name
    );
  } catch (e) {}
};

app.listen(5004, () => {
  console.log(`reservation-service listening on port 5004!!! `);
});

Startup();
