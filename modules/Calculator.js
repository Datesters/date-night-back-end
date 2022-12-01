'use strict';

let cache = require('./cache');
const axios = require('axios');
require('dotenv').config();


async function getLove(req, res) {
  try {
    // need the params from front end
    const key = 'compatibility-';
    const url = `${process.env.LOVE_URL}?&sname=Alice&fname=John`;
    console.log(url);
    let config = {
    // params: { sname: 'Alice', fname: 'John' },
      headers: {
        'X-RapidAPI-Key': `${process.env.X_RAPIDAPI_KEY}`,
        'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
      }
    };
    let result = await axios.get(url, config);
    console.log(result);
    return result;

    // if (cache[key] && (Date.now() - cache[key].timstamp < 50000)) {
    //   console.log('Cache hit');
    // } else {
    //   console.log('Cache miss');
    //   cache[key] = {};
    //   cache[key].timestamp = Date.now();
    //   cache[key].data = await axios.get(url, config)
    //     .then(response => response.data);
    // }
    // console.log(cache[key].data);
  }
  catch (error) {
    console.error(error);
  }
}


class Compatibility {
  constructor(myCompatibility) {
    this.nameOne = myCompatibility.sname;
    this.nameTwo = myCompatibility.fname;
  }
}

module.exports = getLove;
