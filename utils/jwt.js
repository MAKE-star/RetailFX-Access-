const jwt = require("jsonwebtoken");
const { request, response } = require("express");

const generateToken = (data) => {
    let jwtSecretKey = process.env.JWT_SECRECT_KEY;
    const token =  jwt.sign(data,  jwtSecretKey,  {expiresIn: 1800}); //
    return token;
    }

module.exports = generateToken;