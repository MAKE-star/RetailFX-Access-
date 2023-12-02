const { request, response } = require("express");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ActiveDirectory = require("activedirectory");
const role_name = require("../utils/getRoleName");
const User = require("../models/user");
const userActive = require("../utils/userActive");
const sendEmail = require("../utils/sendEmail");
const { loginsuffix,exemptedUsernames } = require("../config/external");

const adConfig = {
  url: process.env.MSAD_URL,
  //baseDN: process.env.MSAD_BASE_CTX_DN,
  bindDN: process.env.MSAD_BIND_DN,
  //bindCredentials: process.env.MSAD_BIND_CREDENTIAL,
};

const ad = new ActiveDirectory(adConfig);

const login = async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  try {
    if (exemptedUsernames.includes(username)) {
      await userActive(username);
      const user = await User.findOne({ where: { USERNAME: username } });
      
      if (!user) {
        return response.status(400).send({
          message: "Incorrect login credentials. Kindly check and try again",
        });
      }

      const checkPassword = bcrypt.compareSync(password, user.PASSWORD);
      if (!checkPassword) {
        return response.status(400).send({
          message: "Incorrect login credentials. Kindly check and try again",
        });
      }

      let data = {
        time: Date(),
        username: username,
        role: user.ROLE_ID,
      };
      let token = await generateToken(data);
      let role_id = user.ROLE_ID;
      const role = await role_name(role_id);
      return response.status(200).send({
        message: "Login Successful",
        JWT: token,
        User: user,
        Role: {
          Id: role?.ID,
          Name: role?.ROLES,
        },
      });
    } else {
      const ad_username = username +  loginsuffix;
      ad.authenticate(ad_username, password, async function (err, auth) {
        //console.log("The Username2",ad_username)
        //console.log("The Password2",password)
        if (err) {
          console.log('Authentication error:', err);
          //console.log("Entered here 1")
          return response.status(404).send({
            status: 404,
            msg: 'Invalid Username or Password',
            data: false,
          });
        }

        if (auth) {
          await userActive(username);
          const user = await User.findOne({ where: { USERNAME: username } });
          
          if (!user) {
            //console.log("Entered here 2")
            return response.status(400).send({
              message: "Incorrect login credentials. Kindly check and try again",
            });
          }

          let data = {
            time: Date(),
            username: username,
            role: user.ROLE_ID,
          };
          let token = await generateToken(data);
          let role_id = user.ROLE_ID;
          const role = await role_name(role_id);
          //console.log("Entered here 3")
     
          return response.status(200).send({
            message: "Login Successful",
            JWT: token,
            User: user,
            Role: {
              Id: role?.ID,
              Name: role?.ROLES,
            },
          });
        } else {
          return response.status(401).send({
            status: 401,
            msg: 'Invalid Username or Password',
            data: false,
          });
        }
      });
    }
  } catch (e) {
    console.error(e);
    return response.status(400).send({
      message: "Provide the required credentials. Please contact the admin",
    });
  }
};



/*const { request, response } = require("express");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
// const validateEmail = require('../utils/emailValidation');
const User = require("../models/user");
const userActive = require("../utils/userActive");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const role_name = require("../utils/getRoleName");

const login = async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  // const ENVIRONMENT = request.body.environment;

  
  try {
    await userActive(username);
    const user = await User.findOne({ where: { USERNAME: username } });

    if (!user) {
      return response.status(400).send({
        message: "Incorrect login credentials. Kindly check and try again",
      });
    }
    const checkPassword = bcrypt.compareSync(password, user.PASSWORD);
    
    if (!checkPassword) {
      return response.status(400).send({
        message: "Incorrect login credentials. Kindly check and try again",
      });
    }
    let data = {
      time: Date(),
      username: username,
      role: user.ROLE_ID,
    };
    let token = await generateToken(data);
    let role_id = user.ROLE_ID;

    const role = await role_name(role_id);
    return response.status(200).send({
      message: "Login Successful",
      JWT: token,
      User: user,
      Role: {
        Id: role?.ID,
        Name: role?.ROLES,
      },
      // "environment": ENVIRONMENT
    });
  } catch (e) {
    console.error(e);
    return response.status(400).send({
      message: "Provide the required credentials. Please contact the admin",
    });
  }
}; 
*/

const forgotPassword = async (request, response) => {
  const token = request.headers.token;
  try {
    const user = await User.findOne({
      where: { USERNAME: request.body.username },
    });
    if (!user) {
      return response.status(404).send({
        message: "User not found",
      });
    }
    let email_id = user.email_id;
    const link = `${process.env.BASE_URL}/reset-password/${token}`;
    const changePassword = await sendEmail(email_id, link);
    if (changePassword) {
      return response.status(200).send({
        message: "Recovery emali sent to your email address",
        data: changePassword.response,
      });
    } else {
      return response.status(400).send({
        message: "Cannot send Verification link.",
      });
    }
  } catch (e) {
    console.error("Error forgot password", e);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};


const resetPassword = async (request, response) => {
  try {
    const token = request.body.token;
    const email_id = request.body.email_id;
    const password = request.body.password;
    const verification = jwt.verify(token, process.env.JWT_SECRECT_KEY);
    if (!verification) {
      return response.send({
        message: "Please Provide token",
      });
    }
    await User.update(
      {
        password: bcrypt.hashSync(password, 10),
      },
      { where: { email_id } }
    );

    return response.status(200).send({
      message: "Password has been updated successfully",
    });
  } catch (e) {
    console.error("Error at reset password", e);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};

