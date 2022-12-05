'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const profile = require('./model/Profile');
mongoose.connect(process.env.DB_URL);




async function seed() {

  await profile.create({
    partnerNameOne: 'Ricardo',
    partnerNameTwo: 'London',
    location: 'Seattle',
    favoriteRestaurant: 'in-n-out burger',

  });
  console.log('profile was added to mongo');

  mongoose.disconnect();
}

seed();
