
'use strict';

const axios = require('axios');
// let cache = require('./modules/cache.js');
require('dotenv').config();


async function getYelp(location) {
  // console.log('hi');
  try {
    // console.log(location);
    // console.log('This is the location: ', location);
    // const key = 'city-';
    const queryUrl = `https://api.yelp.com/v3/businesses/search?location=${location}&sort_by=best_match&matches_party_size_param=true&limit=20`;

    // console.log(queryUrl);

    let config = {
      method: 'GET',
      url: queryUrl,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.YELP_APP_API}`
      }
    };
    
    let result = await axios(config);
    console.log(result.data);
    let resultsArray = result.data.businesses.map(obj => new Restaurant(obj));
    return resultsArray;


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



module.exports = getYelp;
