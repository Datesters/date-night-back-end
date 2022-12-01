'use strict';

// jwt = JSON Web Token (also pronounced Jot);
const jwt = require('jsonwebtoken');

// jwks = JSON Web Key Service
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyUser(req, errorFirstOfUserCallBackFunction) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, errorFirstOfUserCallBackFunction);
  } catch (error) {
    errorFirstOfUserCallBackFunction('Not Authorized');
  }
}

module.exports = verifyUser;
