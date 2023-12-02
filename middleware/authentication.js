const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const ActiveDirectory = require("activedirectory");

//const username = `cn=${req.body.username},ou=users,dc=domain,dc=com`;

const authenticate = function (roles = []) {
  try {
    let verified;
    return async (request, response, next) => {
      const token = request.headers.token;
      if (!token) {
        return response.status(400).send(`Please provide token`);
      }

      try {
        verified = jwt.verify(token, process.env.JWT_SECRECT_KEY);
        request.headers.username = verified.username;
      } catch (error) {
        console.log("token expired error", error);
        return response.status(401).send({
          message: "Token expried",
          success: false,
        });
      }
      
      if (verified) {
        if (roles.length > 0) {
          let access = roles.includes(parseInt(verified.role));
          if (!access) {
            return response.status(403).send(`Access denied`); 
          }
        }
        next();
      } else {
        return response.status(401).send({
          message: "Authentication failed",
          success: false,
        });
      }
    };
  } catch (error) {
    console.log("Error in Authentication", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};



module.exports = authenticate;
