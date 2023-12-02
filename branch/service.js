const { request, response } = require("express");
const uuid = require("uuid").v4;
const { Op } = require("sequelize");
const BranchSettle = require("../models/branchSettle");
const User = require("../models/user");
const sequelize = require("../config/database");
const { UUID } = require("sequelize");

const createBranchSettle  = async (request, response) => {
  const BR_SETTLE_BOOK = request.body.branch_settle_book;
  const BR_SETTLE_CODE = request.body.branch_settle_code;
  const BR_SETTLE_NAME = request.body.branch_settle_name;
  const BR_SETTLE_ACCT = request.body.branch_settle_acct;
  const BR_SETTLE_TYPE = request.body.branch_settle_type;
  const BR_SETTLE_CURRENCY = request.body.branch_settle_currency;
  try {
    /*let branchCheck = await BranchSettle.findOne({
      where: { [Op.or]: [{ BR_SETTLE_CODE }, { BR_SETTLE_NAME }] },
    });
    if (branchCheck) {
      return response.status(400).send({
        message: "Branch Settlement with that Branch Code or Branch Name already exists",
      });
    }*/
    branch = await BranchSettle.create({
      BR_SETTLE_ID: uuid(),
      BR_SETTLE_BOOK,
      BR_SETTLE_CODE,
      BR_SETTLE_NAME,
      BR_SETTLE_ACCT,
      BR_SETTLE_TYPE,
      BR_SETTLE_CURRENCY
    });
    return response.status(200).send({
        message: "BranchSettle created successfully",
        data: branch
      });
    } catch (error) {
      console.log("Settle Type", BR_SETTLE_TYPE);
      console.log("Settle Currency", BR_SETTLE_CURRENCY);
      console.error("Error creating branch settle", error);
      return response.status(400).send({
        message: "Error creating branch settle",
      });
    }
};


const getNostroAccounts =  async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        USERNAME: request.headers.username,
      },
    });

    const branchsettle = await BranchSettle.findAll ({
      where: {
        BR_SETTLE_BOOK: user.BOOK,
        BR_SETTLE_TYPE: 1,
        BR_SETTLE_CURRENCY: request.params.CURRENCY
      }
    });
    console.log("Nostro Accounts", branchsettle);
    return response.status(200).json(branchsettle);
    }catch (error) {
      console.error("Error returning Nostro Accounts", error);
      return response.status(400).send({
        message: `Something went wrong`,
      });
    }
  }//@mayopo



const getBranchsSettle = async (request, response) => {
    try {
      const user = await User.findOne({
        where: {
          USERNAME: request.headers.username,
        },
      });
      const page = request.query.page;
      const limit = 100;
      const offset = (page - 1) * limit;
  
      const branchSettle = await BranchSettle.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
          BR_SETTLE_BOOK: user.BOOK,
        },
        order: [["BR_SETTLE_TYPE", "DESC"], ["BR_SETTLE_CURRENCY", "ASC"]],
      });
      if (branchSettle !== 0) {
        return response.status(200).json(branchSettle);
      }
      return response.status(404).send({
        message: "No BranchSettle entry has been recorded",
      });
    } catch (error) {
      console.error("Error returning BranchSettle details", error);
      return response.status(400).send({
        message: `Something went wrong`,
      });
    }
  };

  const getBranchSettle = async (request, response) => {
    try {
      const branchSettle = await BranchSettle.findOne({
        where: { BR_SETTLE_ID: request.params.branchId },
      });
      if (!branchSettle) {
        return response.status(404).send({
          message: "BranchSettle not found",
        });
      }
      const result = branchSettle.toJSON();
      return response.status(200).json(result);
    } catch (error) {
      console.error("Error getting single BranchSettle detail", error);
      return response.status(400).send({
        message: "Something went wrong",
      });
    }
};

  
  const updateBranchSettle  = async (request, response) => {
    try {
        const branchSettle = await BranchSettle.update(
            {
                BR_SETTLE_ID : request.body.branch_settle_id,
                BR_SETTLE_BOOK : request.body.branch_settle_book,
                BR_SETTLE_CODE : request.body.branch_settle_code,
                BR_SETTLE_NAME : request.body.branch_settle_name,
                BR_SETTLE_ACCT : request.body.branch_settle_acct,
                BR_SETTLE_TYPE : request.body.branch_settle_type,
                BR_SETTLE_CURRENCY : request.body.branch_settle_currency
            },
        
            { where: { BR_SETTLE_ID: request.params.branchId } }
        );
        if (!branchSettle) {
            return response.status(404).send({
              message: " Kindly Provide Valid details",
            });
          }
        return response.status(200).send({
            message: "BranchSettle updated successfully",
          });
    } catch (error) {
        console.error("Error updating branch settle", error);
        return response.status(400).send({
          message: "Error updating branch settle",
        });
    }
};


const deleteBranchSettle = async (request, response) => {
  try {
    const branch = await BranchSettle.findOne({
      where: { BR_SETTLE_ID: request.params.branchId },
    });
    if (branch == null) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    await branch.destroy();

    return response.status(200).send({
      message: `Branch Settlement deleted successfully`,
    });
  } catch (error) {
    console.error("Delete Branch Settlement error", error);
    return response.status(400).send({
      message: `Something went wrong. `,
    });
  }
};


module.exports = {
    createBranchSettle,
    updateBranchSettle,
    getBranchsSettle,
    getBranchSettle,
    getNostroAccounts,
    deleteBranchSettle
};
  
