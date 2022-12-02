'use strict';

let cache = require('./cache');
const axios = require('axios').default;


async function getLove(fname, sname) {
  // need the params from front end
  const key = 'compatibility-' + fname + sname;
  console.log(fname);
  console.log(sname);
  const options = {
    method: 'GET',
    url: process.env.LOVE_URL,
    params: {fname: fname, sname: sname},
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'identity',
      'X-RapidAPI-Key': process.env.LOVE_API,
      'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
    }
  };
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.request(options).then(response => new Compatibility(response.data));
  }
  return cache[key].data;
}


class Compatibility {
  constructor(result) {
    this.nameOne = result.fname;
    this.nameTwo = result.sname;
    this.percentage = result.percentage;
    this.result = result.result;
  }
}

module.exports = getLove;
