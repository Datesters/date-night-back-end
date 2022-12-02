require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// const Location = require('./modules/Location');
const Calculator = require('./modules/Calculator');
const verifyUser = require('./auth');
const { response } = require('express');
const getCity = require('./modules/Location');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3001;


app.get('/Calculator', getCalculator);
// app.get('/Location', getLocation);
app.get('/Location', getCity);


app.post('/location', postReview);
app.delete('/location/:id', deleteReview);
app.put('/location/:id', putReview);


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

async function getCalculator(req, res) {
  const { fname, sname } = req.query;
  getLove(fname, sname)
    .then(sum => res.send(sum))
    .catch((error) => {
      console.error(error);
      res.status(200).send('Sorry. Something went wrong!');
    });
}

async function postReview(req, res, next) {
  try {
    let newReview = await Location.create(req.body);
    res.send(newReview);
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted');
  } catch (error) {
    next(error);
  }
}

async function putReview(req, res, next) {
  try {
    let id = req.params.id;
    let updatedReview = req.body;
    let addReview = await Location.findByIdAndUpdate(id, updatedReview, { new: true, overwrites: true});
    res.status(200).send(addReview);
  } catch (error) {
    next(error);
  }
}


app.get('*', (req, response) => {
  response.status(404).send('Not availabe');
});

app.use((error, req, res) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
