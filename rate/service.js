const { request } = require("express");
const Rate = require("../models/rate");
const User = require("../models/user");
const uuid = require("uuid").v4;
const { Op, where } = require("sequelize");
const rateTable = require("../utils/rateTable");
const sequelize = require("../config/database");
const moment = require("moment");

const createRate = async (request, response) => {
  try {
    let rate;
    let new_rate;

    const existing_rate = await Rate.findOne({
      where: {
        PRIMARY_CCY: request.body.primary_ccy,
        SECONDARY_CCY: request.body.secondary_ccy,
      },
    });
    if (existing_rate !== null) {
      const created_at = moment(existing_rate.CREATED_AT).format("DD/MM/YYYY");
      const updated_at = moment(existing_rate.UPDATED_AT).format("DD/MM/YYYY");
      const today = moment().format("DD/MM/YYYY");
      if (created_at == today || updated_at == today) {
        return response.status(404).send({
          message:
            "Unable to create rate because the currency pair has already been recorded for today",
        });
      }
    }

    /*if (
      request.body.primary_ccy === request.body.secondary_ccy 
    ) 
    */
    
    await Rate.create({
      ID: uuid(),
      PRIMARY_CCY: request.body.primary_ccy,
      SECONDARY_CCY: request.body.secondary_ccy,
      RATE: request.body.rate,
      BOOK: request.body.book
    });
    return response.status(200).send({
      message: "New Currency created successfully",
    });
  
    /*rate = await Rate.create({
      ID: uuid(),
      PRIMARY_CCY: request.body.primary_ccy,
      SECONDARY_CCY: request.body.secondary_ccy,
      RATE: request.body.rate,
    });
    const inverse_rate = rateTable(rate);
    new_rate = await Rate.create({
      ID: uuid(),
      PRIMARY_CCY: request.body.secondary_ccy,
      SECONDARY_CCY: request.body.primary_ccy,
      RATE: inverse_rate,
    }); 

    return response.status(200).send({
      message: "New Currency created successfully",
      inverse: new_rate,
    });*/
  } catch (error) {
    console.error("Error creating Rate", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const getRates = async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        USERNAME: request.headers.username,
      },
    });
    
    const rates = await Rate.findAll({
      where: {
        BOOK: user.BOOK,
      },
      order: [["PRIMARY_CCY", "ASC"]],
    });
    return response.status(200).json(rates);
  } catch (error) {
    console.error("Error show Rate", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};


const updateRate = async (request, response) => {
  try {
    const rate = await Rate.findOne({
      where: { ID: request.params.rateId },
    });
    await Rate.update(
      {
        RATE: parseFloat(request.body.rate),
        UPDATED_AT: new Date(),
      },
      { where: { ID: request.params.rateId } }
    );

    /*const findInverse = await Rate.findOne({
      where: {
        PRIMARY_CCY: rate.SECONDARY_CCY,
        SECONDARY_CCY: rate.PRIMARY_CCY,
      },
    });

    const inverse_rate = 1 / parseFloat(request.body.rate);
    await Rate.update(
      {
        RATE: inverse_rate,
        UPDATED_AT: new Date(),
      },
      { where: { ID: findInverse.ID } }
    );
*/
    return response.status(200).send({
      message: "Rate Updated successfully",
      //inverse: inverse_rate,
    });
  } catch (error) {
    console.error("Error update Rate", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const deleteRate = async (request, response) => {
  try {
    const rate = await Rate.findOne({
      where: { ID: request.params.rateId },
    });

    await rate.destroy();
    const inverse = await Rate.findOne({
      where: {
        PRIMARY_CCY: rate.SECONDARY_CCY,
        SECONDARY_CCY: rate.PRIMARY_CCY,
      },
    });

    await inverse.destroy();
    if (!rate.ID) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    return response.status(200).send({
      message: "Rate deleted successfully",
    });
  } catch (error) {
    console.error("Delete Rate error", error);
    return response.status(400).send(`Something went wrong`);
  }
};

const getCcy = async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        USERNAME: request.headers.username,
      },
    });
    const currencies = await Rate.findAll({
      where: {
        BOOK: user.BOOK,
      },
      order: [["PRIMARY_CCY", "ASC"]],//@MAYOPO
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("PRIMARY_CCY")), "CURRENCY"],
      ],
    });
    if (!currencies) {
      return response.status(404).send({
        message: "No records found",
      });
    }
    return response.status(200).json(currencies);
  } catch (error) {
    console.error(`error in get currencies`, error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createRate,
  getRates,
  updateRate,
  deleteRate,
  getCcy,
};
