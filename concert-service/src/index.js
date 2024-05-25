// const {TICKET_API_URL} = require('./URLs')

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');
// const mongoose = require('mongoose')
// import ConcertModel from "./models/concert";
const ConcertModel = require('./models/concert');
const router = require('./routes');
const cors = require('cors');

const app = express();

// const HttpsAgent = require('agentkeepalive').HttpsAgent;

// const agent = new HttpsAgent({
//     freeSocketTimeout: 5001
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());
app.use('/api', router);

const Startup = async () => {
  try {
    // await mongoose.connect('mongodb://concert-mongo-service:27017/concert', {
    const database = await mongoose.connect(
      // 'mongodb://10.97.201.142:27017/concert',
      'mongodb://concert-mongo-service:27017/concert',
      {
        // useNewUrlParser: true,
        useUnifiedTopology: false,
        // useCreateIndex: true
      }
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
    console.log('fff list', list);
  } catch (e) {
    console.error('fffe', e);
  }
  app.listen(5001, () => {
    console.log(`concert-service listening on port 5001!!! `);
  });
};

Startup();
