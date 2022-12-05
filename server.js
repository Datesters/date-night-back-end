'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const getYelp = require('./modules/yelp.js');
const getLove = require('./modules/compatibility.js');
const verifyUser = require('./auth');
const User = require('./models/Profile.js');
// const { find } = require('./models/Profile.js');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3001;


// app.get('/calculator', getCalculator);
app.get('/location', getCity);
app.put('/location', putLoc);
app.get('/user', getUser);
app.put('/user', putUser);

// app.post('/location', postReview);
// app.delete('/location/:id', deleteReview);
// app.put('/location/:id', putReview);
async function putLoc(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {

      const { favoriteRestaurant } = req.query;
      // console.log(favoriteRestaurant);
      try {
        console.log('found user');
        const userFromDb = await User.find({ email: user.email });

        if (userFromDb.length > 0) {
          console.log('something changed');
          // console.log(userFromDb[0]);
          let updatedUser = await User.findByIdAndUpdate(
            { _id: userFromDb[0]._id },
            { $push: { favoriteRestaurant: favoriteRestaurant } },
            { new: true, overwrite: true }
          );
          res.status(200).send(updatedUser);
          console.log(updatedUser);

        } else {
          res.status(404).send('error');

        }
      } catch (err) {
        console.error(err);
        res.status(500).send('server error');
      }

    }
  });
}

async function getUser(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.log(err);
      res.send('invalid token');
    } else {

      try {
        let findUser = await User.find({ email: user.email });
        if (findUser.length) {
          const userFromDb = await User.find({ email: user.email });
          res.status(200).send(userFromDb);
        } else {
          console.log('no user');
          let createdUser = crateUser({ fname: 'Jack', sname: 'Jill', location: 'paris' }, res, user);
          res.send(createdUser);
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('server error');
      }
    }
  });
}

async function putUser(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {

      const { fname, sname, location } = req.query;
      try {
        console.log('found user');
        const userFromDb = await User.find({ email: user.email });
        if (userFromDb[0].fname === fname && userFromDb[0].sname === sname && userFromDb[0].location === location) {
          console.log('Nothing changed');
          res.status(200).send(userFromDb);
        } else if (userFromDb.length > 0) {
          console.log('something changed');
          let id = await User.find({ email: user.email });
          updateUser(req, res, user, id);
        } else {
          res.status(404).send('error');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('server error');
      }

    }
  });
}

async function crateUser(req, res, user) {
  const { fname, sname, location } = req;
  try {
    let compPercent = await getLove(fname, sname);
    let createdUser = await User.create({ email: user.email, fname: fname, sname: sname, location: location, compPercent: compPercent.percentage });
    return createdUser;
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
}

async function updateUser(req, res, user, id) {
  try {
    // let tempID = '638a7867f8a0bcfc2946c772';
    const { fname, sname, location } = req.query;
    let compPercent = await getLove(fname, sname);
    const updatedUser = await User.findByIdAndUpdate(id[0]._id, { email: user.email, fname: fname, sname: sname, location: location, compPercent: compPercent.percentage }, { new: true, overwrite: true });
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
}

async function getCity(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.log(err);
      res.send('invalid token');
    } else {

      try {
        const { location } = req.query;
        let result = await getYelp(location);
        res.status(200).send(result);
      } catch (error) {
        next(error);
      }

    }
  });
}

// async function getCalculator(req, res) {
//   const { fname, sname } = req.query;
//   getLove(fname, sname)
//     .then(sum => res.send(sum))
//     .catch((error) => {
//       console.error(error);
//       res.status(200).send('Sorry. Something went wrong!');
//     });
// }

// async function postReview(req, res, next) {
//   try {
//     let newReview = await Location.create(req.body);
//     res.send(newReview);
//   } catch (error) {
//     next(error);
//   }
// }

// async function deleteReview(req, res, next) {
//   try {
//     await Location.findByIdAndDelete(req.params.id);
//     res.status(200).send('Deleted');
//   } catch (error) {
//     next(error);
//   }
// }

// async function putReview(req, res, next) {
//   try {
//     let id = req.params.id;
//     let updatedReview = req.body;
//     let addReview = await Location.findByIdAndUpdate(id, updatedReview, { new: true, overwrites: true });
//     res.status(200).send(addReview);
//   } catch (error) {
//     next(error);
//   }
// }


app.get('*', (req, response) => {
  response.status(404).send('Not availabe');
});

app.use((error, req, res) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
