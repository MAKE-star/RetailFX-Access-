const User = require("../models/user");
const { request, response } = require("express");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
const validateEmail = require("../utils/emailValidation");
const { Op } = require("sequelize");
const Product = require("../models/product");
const sequelize = require("../config/database");
const UserProducts = require("../models/userProducts");

const createUser = async (request, response) => {
  const USERNAME = request.body.username;
  const FIRST_NAME = request.body.first_name;
  const LAST_NAME = request.body.last_name;
  const PASSWORD = request.body.password;
  const EMAIL_ID = request.body.email_id;
  const ROLE_ID = request.body.role_id;
  const NOTIFICATION = request.body.notification;
  const ENABLE_RATE = request.body.enable_rate;
  const PHONE_NO = request.body.phone_number;
  const BOOK = request.body.book;
  const isValidEmail = await validateEmail(EMAIL_ID);
  try {
    let user = await User.findOne({
      where: { [Op.or]: [{ USERNAME }, { EMAIL_ID }] },
    });
    if (user) {
      return response.status(400).send({
        message: "User with that Userid or Email-id already exists",
      });
    }
    if (!isValidEmail) {
      return response.status(400).send({
        message: "Invalid Email-id",
      });
    }
    user = await User.create({
      ID: uuid(),
      USERNAME,
      FIRST_NAME,
      LAST_NAME,
      PASSWORD: bcrypt.hashSync(PASSWORD, 10),
      EMAIL_ID,
      IS_ACTIVE: 1,
      ROLE_ID,
      NOTIFICATION,
      ENABLE_RATE,
      BOOK,
      PHONE_NO,
    });

    const products = Array.isArray(request.body.products)
      ? request.body.products.filter(
          (productId) => typeof productId === "string"
        )
      : [];
    if (products.length > 0) {
      await Promise.all(
        products.map((productId) =>
          UserProducts.upsert({
            USERID: user.ID,
            PRODUCTID: productId,
          })
        )
      );
    }

    return response.status(200).send({
      message: "Account created successfully",
    });
  } catch (e) {
    console.error("Error at User create", e);
    return response.status(400).send({
      message:
        "Could not perform operation at this time, kindly try again later.",
    });
  }
};
const getUsers = async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        USERNAME: request.headers.username,
      },
    });
    const page = request.query.page;
    const limit = 100;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        BOOK: user.BOOK,
      },
      order: [["CREATED_AT", "DESC"]],
    });
    if (users != 0) {
      return response.status(200).json(users);
    }
    return response.status(404).send({
      message: "No User entry has been recorded",
    });
  } catch (error) {
    console.error("Error show user", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const getUser = async (request, response) => {
  try {
    const user = await User.findOne({
      where: { ID: request.params.userId },
    });
    if (!user) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    const result = user.toJSON();
    result.products = await getProductsForUser(user.ID);
    return response.status(200).json(result);
  } catch (error) {
    console.error("Error read one User", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const updateUser = async (request, response) => {
  try {
    let date = new Date();
    const user = await User.findOne({
      where: { ID: request.params.userId },
    });
    if (!user) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    const payload = request.body.password
      ? {
          FIRST_NAME: request.body.first_name,
          LAST_NAME: request.body.last_name,
          PASSWORD: bcrypt.hashSync(request.body.password, 10),
          EMAIL_ID: request.body.email_id,
          PHONE_NO: request.body.phone_no,
          UPDATED_AT: date,
          NOTIFICATION: request.body.notification,
          ENABLE_RATE: request.body.enable_rate,
        }
      : {
          FIRST_NAME: request.body.first_name,
          LAST_NAME: request.body.last_name,
          EMAIL_ID: request.body.email_id,
          PHONE_NO: request.body.phone_no,
          BOOK: request.body.book,
          ENABLE_RATE: request.body.enable_rate,
          NOTIFICATION: request.body.notification,
          UPDATED_AT: date,
        };

    const products = Array.isArray(request.body.products)
      ? request.body.products.filter(
          (productId) => typeof productId === "string"
        )
      : [];
    if (products.length > 0) {
      await Promise.all(
        products.map((productId) =>
          UserProducts.upsert({
            USERID: user.ID,
            PRODUCTID: productId,
          })
        )
      );
    }

    await User.update(payload, { where: { ID: request.params.userId } });

    return response.status(200).send({
      message: `User updated successfully`,
    });
  } catch (error) {
    console.error("Error update user", error);
    return response.status(400).send({
      message: `Something went wrong.`,
    });
  }
};

const deleteUser = async (request, response) => {
  try {
    const user = await User.findOne({
      where: { ID: request.params.userId },
    });
    if (user == null) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    await user.destroy();

    return response.status(200).send({
      message: `User deleted successfully`,
    });
  } catch (error) {
    console.error("Delete User error", error);
    return response.status(400).send({
      message: `Something went wrong. `,
    });
  }
};

const deactivateUser = async (request, response) => {
  try {
    await User.update(
      {
        IS_ACTIVE: request.body.status,
      },
      {
        where: { ID: request.params.userId },
      }
    );

    const user = await User.findOne({
      where: { ID: request.params.userId },
    });
    return response.status(200).send({
      message: "Account deactivated successfully",
      is_Active: user?.IS_ACTIVE,
    });
  } catch (e) {
    console.error("error in deactivate user", e);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const getMe = async (request, response) => {
  try {
    const user = await User.findOne({
      where: { USERNAME: request.headers.username },
    });
    if (!user) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    const result = user.toJSON();
    result.products = await getProductsForUser(user.ID);
    return response.status(200).json(result);
  } catch (error) {
    console.error("Error read one User", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const getProductsForUser = async (userId) => {
  const userProducts = await UserProducts.findAll({
    where: {
      USERID: userId,
    },
  });

  const productIds = userProducts.map((up) => up.PRODUCTID);

  const products = await Product.findAndCountAll({
    where: {
      PRODUCT_ID: productIds,
    },
    limit: 100,
    offset: 0,
    order: [["CREATED_AT", "DESC"]],
  });
  //console.log("Products per user :", products);
  //console.log("Products per user  2 :", products.rows);
  return products
};


module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  getMe,
  getProductsForUser,
};
