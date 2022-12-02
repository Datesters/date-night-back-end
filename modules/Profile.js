'use strict';


const mongoose = require('mongoose');

const { Schema } = mongoose;

const profileSchema = new Schema({
  partnerNameOne: {type: String, required: true},
  partnerNameTwo: {type: String, required: true},
  location: {type: String, required: true},
  favoriteRestaurant: {type: Array, required: true},

});

const profileModel = mongoose.model('profile', profileSchema);

module.exports = profileModel;
