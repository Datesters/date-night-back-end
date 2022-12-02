'use strict';

const axios = require('axios');
// let cache = require('./modules/cache.js');
require('dotenv').config();

async function getCity(req, res) {
  try {

    let location = req.query;
    console.log('This is the location ', location);
    // const key = 'city-';
    const url = `https://api.yelp.com/v3/businesses/search?location=${location}&sort_by=best_match&matches_party_size_param=true&limit=20`;

    console.log(url);

    let config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.YELP_API_KEY}`
      }
    };
    // console.log(config);
    let result = await axios.get(url, config);
    let resultArray = result.data.businesses.map(obj => new Restaurant(obj));
    res.status(200).send(resultArray);


  }catch (error) {
    return Promise.reject(error);
  }
}

class Restaurant {
  constructor(restaurant) {
    this.image = restaurant.image_url;
    this.name = restaurant.name;
    this.rating = restaurant.rating;
    this.address = restaurant.location.display_address;
    this.phoneNumber = restaurant.display_phone;
  }
}



module.exports = getCity;

