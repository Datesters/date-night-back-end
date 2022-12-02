
'use strict';

const axios = require('axios');
let cache = require('./yelpCache.js');
require('dotenv').config();


async function getYelp(loc) {
  const key = 'city-' + loc;
  let config = {
    method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/search',
    params: { location: loc, sort_by: 'best_match', matches_party_size_param: true, limit: '5' },
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'identity',
      Authorization: `Bearer ${process.env.YELP_APP_API}`
    }
  };

  // let results = await axios(config).then(response => parseLoc(response.data));
  // return results;
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios(config)
      .then(response => parseLoc(response.data));
  }

  return cache[key].data;
}

function parseLoc(locData) {
  try {
    const locSummaries = locData.businesses.map(loc => {
      return new Restaurant(loc);
    });
    return Promise.resolve(locSummaries);
  } catch (e) {
    return Promise.reject(e);
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
