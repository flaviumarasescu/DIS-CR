const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');

const ConcertModel = require('./models/concert');
const router = require('./routes');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());
app.use('/api', router);

const Startup = async () => {
  try {
    const database = await mongoose.connect(
      'mongodb://concert-mongo-service:27017/concert'
    );
    console.log(
      'connected to mongo concert',
      database.connection.host,
      database.connection.port,
      database.connection.name
    );
    const newConcert = new ConcertModel({
      name: 'concert 1',
      date: new Date(),
      venue: 'Venue 1',
      tickets: [
        {
          seat_number: 1,
          price: 1,
        },
      ],
    });
    await newConcert.save();
    const list = await ConcertModel.find({});
    console.log('list', list);
  } catch (e) {
    console.error('error', e);
  }
  app.listen(5001, () => {
    console.log(`concert-service listening on port 5001!!! `);
  });
};

Startup();
