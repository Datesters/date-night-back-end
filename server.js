require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Location = require('./model/Location');
const Calculator = require(./model/Calculator);
const verifyUser = require('./auth');
const { response } = require('express');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3001;

app.get('/test', (req, res) => {
  response.send('test request received');
});

async function getLocation(req, res, next) {

  verifyUser(req, async (err, user) => {
    console.log(user);
    if (err) {
      //console.log(err);
      res.send('invalid token');
    } else {

      try {
        let result = await Location.find();
        res.status(200).send(result);
      } catch (error) {
        next(error);
      }
    }
  });
}


app.get('*', (req, response) => {
  response.status(404).send('Not availabe');
});

app.use((error, req, res) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
