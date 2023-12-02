const { request, response } = require("express");
const Product = require("../models/product");
const ProductDetails = require("../models/productDetails");
const Trade = require("../models/trade");
const uuid = require("uuid").v4;
const ProductCategory = require("../models/productCategory");
const sequelize = require("sequelize");
const User = require("../models/user");
const { getProductsForUser } = require("../user/service");
const db = require("../config/database");

const createProduct = async (request, response) => {
  try {
    const product = await Product.create({
      PRODUCT_ID: uuid(),
      PRODUCT_TYPE: request.body.product_type,
      BOOK: request.body.book,
      CALYPSO_LE: request.body.calypso_le,
      PRODUCT_NAME: request.body.product_name,
      REF_CCY: request.body.ref_ccy,
      GL: request.body.gl,
      SPOT: request.body.spot,
      SHOW_FORMA: request.body.show_forma,
      SHOW_DORM: request.body.show_dorm,
      SHOW_ALLOCATION: request.body.show_allocation,
      CREATED_AT: new Date(),
    });
    return response.status(200).send({
      message: "Product created successfully",
      show_FormA: product?.SHOW_FORMA,
    });
  } catch (error) {
    console.error("Error ProductSetup create", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const getProducts = async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        USERNAME: request.headers.username,
      },
    });
    if (user.ROLE_ID === 1) {
      const products = await getProductsForUser(user.ID);

      return response.status(200).json(products);
    }
    const products = await ProductDetails.findAndCountAll({
      where: {
        BOOK: user.BOOK,
      },
      limit: 100,
      offset: 0,
      order: [["PRODUCT_NAME", "ASC"]],
    });
    if (products != 0) {
      return response.status(200).json(products);
    }
    return response.status(404).send({
      message: "No product entry has been recorded",
    });
  } catch (error) {
    console.error("Error Product  Read", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const getProduct = async (request, response) => {
  try {
    const product = await Product.findOne({
      where: { PRODUCT_ID: request.params.productId },
    });
    if (!product) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    return response.status(200).json(product);
  } catch (error) {
    console.error("Error Product setup read Item", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (request, response) => {
  try {
    let date = new Date();

    const product = await Product.update(
      {
        PRODUCT_TYPE: request.body.product_type,
        BOOK: request.body.book,
        PRODUCT_NAME: request.body.product_name,
        REF_CCY: request.body.ref_ccy,
        GL: request.body.gl,
        SPOT: request.body.spot,
        CALYPSO_LE: request.body.calypso_le,
        UPDATED_AT: date,
        SHOW_FORMA: request.body.show_forma,
        SHOW_DORM: request.body.show_dorm,
        SHOW_ALLOCATION: request.body.show_allocation,
      },

      { where: { PRODUCT_ID: request.params.productId } }
    );
    if (!product) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    return response.status(200).send({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error Product Setup Update", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const deleteProduct = async (request, response) => {
  try {
    const product = await Product.findOne({
      where: { PRODUCT_ID: request.params.productId },
    });
    if (product == null) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }

    const trade = await Product.findAll({
      where: { PRODUCT_ID: request.params.productId },
    });

    const trades = await Trade.findAll({
      where: { PRODUCT_ID: request.params.productId },
    });
    if (trades.length === 0) {
      await product.destroy();
      return response.status(200).send({
        message: "Product deleted successfully",
      });
    } else {
      return response.status(400).send({
        message: "Cannot delete product with linked trade",
      });
    }
  } catch (error) {
    console.error("Error ProductSetup Delete", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const getProductCategory = async (request, response) => {
  try {
    const category = await ProductCategory.findAndCountAll({
      limit: 15,
      offset: 0,
    });
    return response.status(200).json(category);
  } catch (error) {
    console.error("Error product category", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const searchProduct = async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        USERNAME: request.headers.username,
      },
    });

    const dbName = process.env.DB_SCHEMA; //|| "ANONYMOUS"; 

    let searchFor = request.query.search.toLowerCase();
    let product = await Product.findAll({
      where: {
        PRODUCT_NAME: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("PRODUCT_NAME")),
          "LIKE",
          "%" + searchFor + "%"
        ),
      },
    });

    /*if (user.ROLE_ID === 1) {
      const query = `
      SELECT p.* FROM ANONYMOUS.PRODUCT p 
      LEFT JOIN ANONYMOUS.USER_PRODUCTS up ON p.PRODUCT_ID = up.PRODUCTID
      WHERE up.USERID = :userId AND LOWER(p.PRODUCT_NAME) LIKE :searchTerm
      */
      if (user.ROLE_ID === 1) {
        const query = `
          SELECT p.* FROM ${dbName}.PRODUCT p 
          LEFT JOIN ${dbName}.USER_PRODUCTS up ON p.PRODUCT_ID = up.PRODUCTID
          WHERE up.USERID = :userId AND LOWER(p.PRODUCT_NAME) LIKE :searchTerm
      `;
      const products = await db.query(query, {
        replacements: {
          userId: user.ID,
          searchTerm: `%${searchFor}%`,
        },
        type: sequelize.QueryTypes.SELECT,
      });

      return response.status(200).json(products);
    }

    if (!product) {
      return response.status(404).send({
        message: "Product not found",
      });
    }
    return response.status(200).json(product);
  } catch (error) {
    return response.status(400).send;
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getProductCategory,
  searchProduct,
};
