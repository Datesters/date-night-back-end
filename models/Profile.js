'use strict';


const mongoose = require('mongoose');

const { Schema } = mongoose;

const profileSchema = new Schema({
  email: {type: String, required: true},
  fname: {type: String, required: true},
  sname: {type: String, required: true},
  location: {type: String, required: true},
  compPercent: {type: String, required: true},
  favoriteRestaurant: {type: Array, required: true},
});

const profileModel = mongoose.model('profile', profileSchema);

module.exports = profileModel;
