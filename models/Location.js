'use strict';


const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
  partnerNameOne: {type: String, required: true},
  partnerNameTwo: {type: String, required: true},
  location: {type: String, required: true},
  favoriteRestaurant: {type: Array, required: true},
});

const locationModel = mongoose.model('Location', locationSchema);

module.exports = locationModel;
