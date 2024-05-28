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

const Startup = () => {
  try {
  } catch (e) {}
};

app.listen(5003, () => {
  console.log(`pdf converter-service listening on port 5003!!!`);
});

Startup();
