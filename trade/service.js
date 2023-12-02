const Trade = require("../models/trade");
const TradeDetails = require("../models/tradeDetails");
const dataUploader = require("../utils/dataUploader");
const { Op, DATE } = require("sequelize");
const sequelize = require("../config/database");
const TradeStatus = require("../utils/enum");
const getAccountDetails = require("../utils/getAccountDetails");
const { request, response, raw } = require("express");
const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const User = require("../models/user");
const uuid = require("uuid").v4;
const strftime = require("strftime");
const { round } = require("../utils/calculation");
const Rate = require("../models/rate");
const { exchange_rate3 } = require("../utils/calculation");
const apiConfig = require("../config/external");
const { writeFileSync } = require("fs");
const path = require("path");
const moment = require("moment");
const TransactionLog = require("../models/transactionLog");
const { timeStamp } = require("console");
const BranchSettle = require("../models/branchSettle");

const createTrade = async (request, response) => {
  let acc_balance = request.body.acc_balance;
  let we_sell = request.body.we_sell;
  let debit_amount = request.body.debit_amount;
  let ref_amount = request.body.ref_amount;
  let exchange_rate1 = request.body.exchange_rate1;
  let exchange_rate2 = request.body.exchange_rate2;

  try {
    const getProductName = await Product.findOne({
      where: { PRODUCT_ID: request.body.product_id },
    });
    let product_name = getProductName.PRODUCT_NAME;
    /*const product_type = getProductName.PRODUCT_TYPE;
    const productCategory = await ProductCategory.findOne({
      where: { PRODUCT_TYPE: product_type },
    });

    */
    
    const traderesponse = await Trade.create({
      ID: uuid(),
      TRADE_DATE: request.body.trade_date,
      PRODUCT_ID: request.body.product_id,
      ACC_NO: request.body.acc_no,
      ACC_NAME: request.body.acc_name,
      ACC_BALANCE: acc_balance,
      ACC_CURRENCY: request.body.acc_currency,
      BRANCH: request.body.branch,
      CUSTOMER_REF: request.body.customer_ref,
      DIRECTION: request.body.direction,
      DIRECTION_CCY: request.body.direction_ccy,
      WE_SELL: we_sell,
      WE_SELL_CCY: request.body.we_sell_ccy,
      EXCHANGE_RATE1: exchange_rate1,
      DEBIT_AMOUNT: debit_amount,
      DEBIT_CCY: request.body.acc_currency,
      EXCHANGE_RATE2: exchange_rate2,
      REF_AMOUNT: ref_amount,
      REF_CCY: request.body.ref_ccy,
      SELL_SETTLE_DATE: request.body.reference_ccy_settle_date,
      COMMENT: request.body.comment,
      STATUS: TradeStatus.PENDING,
      DORM_ACCNO: request.body.dorm_accno,
      DORM_ACCNAME: request.body.dorm_accname,
      DORMACC_CURRENCY: request.body.dormacc_currency,
      //NOSTRO_ACCNO: request.body.nostro_acct,//@mayopo
      TRANSFER_PURPOSE: request.body.transfer_purpose,
      FORM_A_NO: request.body.form_a_no,
      PASSPORT_NO: request.body.passport_no,
      TRAVEL_COUNTRY: request.body.travel_country,
      E_TICKET_NO: request.body.e_ticket_no,
      APPLICATION_NO: request.body.application_no,
      TRAVEL_DATE: request.body.travel_date,
      CUSTOMER_DEBIT_SETTLE_DATE: request.body.trade_date,
      REFERENCE_CCY_SETTLE_DATE: request.body.reference_ccy_settle_date,
      USERNAME: request.headers.username,
      AUTHORIZER_COMMENT: request.body.authorizer_comment,
      PRODUCT_NAME: product_name,
    });
    

    return response.status(200).send({
      message: `Trade created succssfully.`,
      status: traderesponse.STATUS,
    });
  } catch (error) {
    console.error("Error Trade create", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const getTrades = async (request, response) => {
  try {
    const page = request.query.page;
    const limit = 15;
    const offset = (page - 1) * limit;

    const trades = await Trade.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["CREATED_AT", "DESC"]],
    });

    if (trades != 0) {
      return response.status(200).json(trades);
    }
    return response.status(404).send({
      message: "No trade entry has been recorded",
    });
  } catch (error) {
    console.error("Show trade error", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const getTrade = async (request, response) => {
  try {
    const trade = await Trade.findOne({
      where: { ID: request.params.tradeId },
    });
    if (!trade) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    return response.status(200).json(trade);
  } catch (error) {
    console.error("Get trade item error", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const updateTrade = async (request, response) => {
  try {
    let we_sell = request.body.we_sell;
    let debit_amount = request.body.debit_amount;
    let ref_amount = request.body.ref_amount;
    let travel_date = request.body.travel_date;
    const findTrade = await Trade.findOne({
      where: { ID: request.params.tradeId },
    });

    if (!findTrade) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }

    const roleId = request.headers.role_id; 

    if (roleId === '1') {
      request.headers.username = '';
    }

    await Trade.update(
      {
        TRADE_DATE: request.body.trade_date,
        PRODUCT_ID: request.body.product_id,
        ACC_NO: request.body.acc_no,
        ACC_NAME: request.body.acc_name,
        ACC_BALANCE: request.body.acc_balance || undefined,
        ACC_CURRENCY: request.body.acc_currency,
        BRANCH: request.body.branch,
        CUSTOMER_REF: request.body.customer_ref,
        DIRECTION: request.body.direction,
        DIRECTION_CCY: request.body.direction_ccy,
        WE_SELL: request.body.we_sell || undefined,
        WE_SELL_CCY: request.body.we_sell_ccy,
        EXCHANGE_RATE1: request.body.exchange_rate1 || undefined,
        DEBIT_AMOUNT: request.body.debit_amount || undefined,
        DEBIT_CCY: request.body.debit_ccy,
        EXCHANGE_RATE2: request.body.exchange_rate2 || undefined,
        REF_AMOUNT: request.body.ref_amount || undefined,
        REF_CCY: request.body.ref_ccy,
        SELL_SETTLE_DATE: request.body.reference_ccy_settle_date,
        COMMENT: request.body.comment,
        // STATUS: request.body.status,
        DORM_ACCNO: request.body.dorm_accno,
        DORM_ACCNAME: request.body.dorm_accname,
        DORMACC_CURRENCY: request.body.dormacc_currency,
        //NOSTRO_ACCNO: request.body.nostro_acct,//@mayopo
        TRANSFER_PURPOSE: request.body.transfer_purpose,
        FORM_A_NO: request.body.form_a_no,
        PASSPORT_NO: request.body.passport_no,
        TRAVEL_COUNTRY: request.body.travel_country,
        E_TICKET_NO: request.body.e_ticket_no,
        APPLICATION_NO: request.body.application_no,
        TRAVEL_DATE: request.body.travel_date || undefined,
        CUSTOMER_DEBIT_SETTLE_DATE: request.body.trade_date,
        REFERENCE_CCY_SETTLE_DATE: request.body.reference_ccy_settle_date,
        AUTHORIZER_COMMENT: request.body.authorizer_comment,
        USERNAME1: request.headers.username,
        UPDATED_AT: new Date(),
      },
      {
        where: {
          ID: request.params.tradeId,
        },
      }
    );
    if (we_sell) {
      let we_sell_round = Number(we_sell).toFixed(2);
      await Trade.update(
        {
          WE_SELL: we_sell_round,
        },
        { where: { ID: request.params.tradeId } }
      );
    }
    if (debit_amount) {
      let debit_amount_round = Number(debit_amount).toFixed(2);
      await Trade.update(
        {
          DEBIT_AMOUNT: debit_amount_round,
        },
        { where: { ID: request.params.tradeId } }
      );
    }
    if (ref_amount) {
      let ref_amount_round = Number(ref_amount).toFixed(2);
      await Trade.update(
        {
          REF_AMOUNT: ref_amount_round,
        },
        { where: { ID: request.params.tradeId } }
      );
    }
    if (travel_date) {
      let formatted_travel_date = new Date(travel_date);
      await Trade.update(
        { TRAVEL_DATE: formatted_travel_date },
        { where: { ID: request.params.tradeId } }
      );
    }

    const tradedata_simple = await TradeDetails.findOne({
      where: { ID: request.params.tradeId },
      attributes: [
        ["ID", "TradeId"],
        ["CUSTOMER_REF", "ExternalRefId"],
        ["DIRECTION_CCY", "Currency"],
        ["WE_SELL", "TradeNotional"],
        ["TRADE_DATE", "TradeDate"],
        ["SELL_SETTLE_DATE", "SettlementDate"],
        ["C_COMMENT", "Comment"],
        ["PRODUCT_NAME", "keyword.RT_ProductName"],
        ["ACC_NAME", "keyword.RT_CustDebitName"],
        ["ACC_NO", "keyword.RT_CustDebitAcct"],
        ["BRANCH", "keyword.RT_Branch"] ,
        ["DORM_ACCNAME", "keyword.RT_SettleName"],
        ["DORM_ACCNO", "keyword.RT_SettleAcct"],
        ["SETTLE_TYPE","keyword.RT_SettleType"],
      ],
      raw: true,
    });

    const row1 = await TradeDetails.findOne({
      where: { ID: request.params.tradeId },
      attributes: [
        ["ID", "TradeId"],
        [sequelize.literal("\"CUSTOMER_REF\" || '- 1'"), "ExternalRefId"],
        //["DIRECTION", "BuySell"],
        ["WE_SELL_CCY", "PrimaryCurrency"],
        ["WE_SELL", "PrimaryAmount"],
        ["REF_CCY", "SecondaryCurrency"],
        ["REF_AMOUNT", "SecondaryAmount"],
        ["EXCHANGE_RATE1", "SpotRate"],
        ["TRADE_DATE", "TradeDate"],
        ["SELL_SETTLE_DATE", "SettlementDate"],
        ["C_COMMENT", "Comment"],
        ["PRODUCT_NAME", "keyword.RT_ProductName"],
        ["ACC_NAME", "keyword.RT_CustDebitName"],
        ["ACC_NO", "keyword.RT_CustDebitAcct"],
        ["BRANCH", "keyword.RT_Branch"] ,
        ["DORM_ACCNAME", "keyword.RT_SettleName"],
        ["DORM_ACCNO", "keyword.RT_SettleAcct"],
        ["SETTLE_TYPE","keyword.RT_SettleType"],
        ["FORM_A_NO", "keyword.RT_FormANo"],
        ["PASSPORT_NO", "keyword.RT_PassportNo"],
        ["TRAVEL_COUNTRY", "keyword.RT_TravelCountry"],
        ["E_TICKET_NO", "keyword.RT_ETicketNo"],
        ["APPLICATION_NO", "keyword.RT_ApplicationNo"],
        ["TRAVEL_DATE", "keyword.RT_TravelDate"],
      ],
      raw: true,
    });

    const row2 = await TradeDetails.findOne({
      where: { ID: request.params.tradeId },
      attributes: [
        ["ID", "TradeId"],
        [sequelize.literal("\"CUSTOMER_REF\" || '- 2'"), "ExternalRefId"],
        //["DIRECTION", "BuySell"],
        ["REF_CCY", "PrimaryCurrency"],
        ["REF_AMOUNT", "PrimaryAmount"],
        ["ACC_CURRENCY", "SecondaryCurrency"],
        ["DEBIT_AMOUNT", "SecondaryAmount"],
        ["EXCHANGE_RATE2", "SpotRate"],
        ["TRADE_DATE", "TradeDate"],
        ["SELL_SETTLE_DATE", "SettlementDate"],
        ["C_COMMENT", "Comment"],
        ["PRODUCT_NAME", "keyword.RT_ProductName"],
        ["ACC_NAME", "keyword.RT_CustDebitName"],
        ["ACC_NO", "keyword.RT_CustDebitAcct"],
        ["BRANCH", "keyword.RT_Branch"] ,
        ["DORM_ACCNAME", "keyword.RT_SettleName"],
        ["DORM_ACCNO", "keyword.RT_SettleAcct"],
        ["SETTLE_TYPE","keyword.RT_SettleType"],
        ["FORM_A_NO", "keyword.RT_FormANo"],
        ["PASSPORT_NO", "keyword.RT_PassportNo"],
        ["TRAVEL_COUNTRY", "keyword.RT_TravelCountry"],
        ["E_TICKET_NO", "keyword.RT_ETicketNo"],
        ["APPLICATION_NO", "keyword.RT_ApplicationNo"],
        ["TRAVEL_DATE", "keyword.RT_TravelDate"],
      ],
      raw: true,
    });
    const ref_ccy = findTrade.REF_CCY;
    const debit_ccy = findTrade.ACC_CURRENCY;
    const tradeData_secondCCy = await TradeDetails.findOne({
      where: { ID: request.params.tradeId },
      attributes: [
        ["ID", "TradeId"],
        ["CUSTOMER_REF", "ExternalRefId"],
        //["DIRECTION", "BuySell"],
        ["WE_SELL_CCY", "PrimaryCurrency"],
        ["WE_SELL", "PrimaryAmount"],
        ["DEBIT_CCY", "SecondaryCurrency"],
        ["DEBIT_AMOUNT", "SecondaryAmount"],
        [
          sequelize.literal('CASE WHEN "EXCHANGE_RATE2" = 1 THEN "EXCHANGE_RATE1" ELSE "EXCHANGE_RATE2" END'),
          'SpotRate'
        ],
        ["TRADE_DATE", "TradeDate"],
        ["SELL_SETTLE_DATE", "SettlementDate"],
        ["C_COMMENT", "Comment"],
        ["PRODUCT_NAME", "keyword.RT_ProductName"],
        ["ACC_NAME", "keyword.RT_CustDebitName"],
        ["ACC_NO", "keyword.RT_CustDebitAcct"],
        ["BRANCH", "keyword.RT_Branch"] ,
        ["DORM_ACCNAME", "keyword.RT_SettleName"],
        ["DORM_ACCNO", "keyword.RT_SettleAcct"],
        ["SETTLE_TYPE","keyword.RT_SettleType"],
        ["FORM_A_NO", "keyword.RT_FormANo"],
        ["PASSPORT_NO", "keyword.RT_PassportNo"],
        ["TRAVEL_COUNTRY", "keyword.RT_TravelCountry"],
        ["E_TICKET_NO", "keyword.RT_ETicketNo"],
        ["APPLICATION_NO", "keyword.RT_ApplicationNo"],
        ["TRAVEL_DATE", "keyword.RT_TravelDate"],
      ],
      raw: true,
    });

    if (request.body.status == 1) {
      const productData = await Product.findOne({
        where: {
          PRODUCT_ID: findTrade.PRODUCT_ID,
        },
      });

      const product_type = productData.PRODUCT_TYPE;

      const productCategory = await ProductCategory.findOne({
        where: { ID: product_type },
      });

      const getTraderName = await User.findOne({
        where: {ROLE_ID: 1 },
      });
      //let first_name = getTraderName.FIRST_NAME;
      //let last_name = getTraderName.LAST_NAME;
      let userName = getTraderName.USERNAME;

      //const mainTraderName = first_name + " " + last_name;
      const mainTraderName = userName;

      const tradeDate = moment(findTrade.TRADE_DATE).format("DD/MM/YYYY");

      await TransactionLog.upsert({
        TRANSACTION_ID: findTrade.CUSTOMER_REF,
        TRANSACTION_DATE: findTrade.TRADE_DATE,
        SETTLE_DATE: findTrade.SELL_SETTLE_DATE,
        PRODUCT_ID: findTrade.PRODUCT_ID,
        ACCOUNT_NUMBER: findTrade.ACC_NO,
        CURRENCY: findTrade.ACC_CURRENCY,
        TRANSACTION_AMOUNT: findTrade.DEBIT_AMOUNT,
        //Narration = `${tradeData.PRODUCT_NAME} || ${tradeData.ACC_NO} || ${tradeData.ACC_NAME} || ${tradeData.CUSTOMER_REF} `;
        NARRATION: `${findTrade.PRODUCT_NAME} - ${findTrade.ACC_NO} - ${findTrade.ACC_NAME} - ${findTrade.CUSTOMER_REF}`,
        CONTRA_ACCOUNT: productData.CALYPSO_LE,
        BRANCH_CODE: findTrade.BRANCH,
        USERNAME: request.headers.username,
        USERNAME1: mainTraderName
      });

      const error = await tradeApproved(
        findTrade,
        productData,
        request.headers.username
      );

      if (error) {
        console.log("Error", error);//@mayopo
        return response.status(400).send({
      message: error.context,
    });
        //return response.status(400).json(error);
      }

      if (findTrade.DIRECTION_CCY == findTrade.DEBIT_CCY) {
        tradedata_simple.TraderName = mainTraderName;
        tradedata_simple.Counterparty = productData.CALYPSO_LE;
        tradedata_simple.Book = productData.BOOK;
        tradedata_simple["keyword.RT_SourceOfFunds"] = productCategory.CATEGORY;
        tradedata_simple.TradeDate = strftime(
          "%Y%m%d",
          new Date(tradedata_simple.TradeDate)
        );
        tradedata_simple.SettlementDate = strftime(
          "%Y%m%d",
          new Date(tradedata_simple.SettlementDate)
        );

        // roundTradeAmounts(tradedata_simple);

        await dataUploader.json2Csv_simple(tradedata_simple);
      } else if (
        findTrade.WE_SELL_CCY !== findTrade.ACC_CURRENCY &&
        findTrade.WE_SELL_CCY !== findTrade.REF_CCY &&
        findTrade.ACC_CURRENCY !== findTrade.REF_CCY
      ) {
        row1.TraderName = mainTraderName;
        row1.Counterparty = productData.CALYPSO_LE;
        row1.Book = productData.BOOK;
        row1["keyword.RT_SourceOfFunds"] = productCategory.CATEGORY;
        row1.TradeDate = strftime("%Y%m%d", new Date(row1.TradeDate));
        row1.SettlementDate = strftime("%Y%m%d", new Date(row1.SettlementDate));
        if (
          row1["keyword.RT_TravelDate"] !== null &&
          row1["keyword.RT_TravelDate"] !== undefined &&
          row1["keyword.RT_TravelDate"] !== ""
        ) {
          row1["keyword.RT_TravelDate"] = strftime(
            "%Y%m%d",
            new Date(row1["keyword.RT_TravelDate"])
          );
        } else {
          row1["keyword.RT_TravelDate"] = "";
        }

        let newPrimAmount1 = row1.PrimaryAmount;
        let newSecAmount1 = row1.SecondaryAmount;
        let newPrimCCY1 = row1.PrimaryCurrency;
        let newSecCCY1 = row1.SecondaryCurrency;
        let newRate = await exchange_rate3(
          row1.PrimaryCurrency,
          row1.SecondaryCurrency
        );
        if (newRate == 0) {
          row1.PrimaryCurrency = newSecCCY1;
          row1.SecondaryCurrency = newPrimCCY1;
          row1.PrimaryAmount = newSecAmount1;
          row1.SecondaryAmount = newPrimAmount1;
          // I had to flip the direction anytime we flip amount
        }

        if (row1.SecondaryCurrency == findTrade.WE_SELL_CCY) {
          row1.BuySell = "BUY";
        } else {
          row1.BuySell = "SELL";
        }
        // roundTradeAmounts(row1);

        row2.TraderName = mainTraderName;
        row2.Counterparty = productData.CALYPSO_LE;
        row2.Book = productData.BOOK;
        row2["keyword.RT_SourceOfFunds"] = productCategory.CATEGORY;
        row2.TradeDate = strftime("%Y%m%d", new Date(row2.TradeDate));
        row2.SettlementDate = strftime("%Y%m%d", new Date(row2.SettlementDate));
        /*
        let newRate = await exchange_rate3(ref_ccy, debit_ccy);
        //row2.SpotRate = await exchange_rate3(ref_ccy, debit_ccy);
        if (newRate == 0) {
          newRate =  await exchange_rate3(debit_ccy, ref_ccy);
        } 
        row2.SpotRate = newRate;
        */

        
        if (
          row2["keyword.RT_TravelDate"] !== null &&
          row2["keyword.RT_TravelDate"] !== undefined &&
          row2["keyword.RT_TravelDate"] !== ""
        ) {
          row2["keyword.RT_TravelDate"] = strftime(
            "%Y%m%d",
            new Date(row2["keyword.RT_TravelDate"])
          );
        } else {
          row2["keyword.RT_TravelDate"] = "";
        }
        let newPrimAmount = row2.PrimaryAmount;
        let newSecAmount = row2.SecondaryAmount;
        let newPrimCCY = row2.PrimaryCurrency;
        let newSecCCY = row2.SecondaryCurrency;
        let newRate2 = await exchange_rate3(
          row2.PrimaryCurrency,
          row2.SecondaryCurrency
        );
        if (newRate2 == 0) {
          row2.PrimaryCurrency = newSecCCY;
          row2.SecondaryCurrency = newPrimCCY;
          row2.PrimaryAmount = newSecAmount;
          row2.SecondaryAmount = newPrimAmount;
          // I had to flip the direction anytime we flip amounts
        }

        if (row2.SecondaryCurrency == findTrade.DEBIT_CCY) {
          row2.BuySell = "SELL"
        } else {
          row2.BuySell = "BUY"
        }
        // roundTradeAmounts(row2);

        await dataUploader.json2Csv_threeCCy(row1, row2);
      } else {
        tradeData_secondCCy.TraderName = mainTraderName;
        tradeData_secondCCy.Counterparty = productData.CALYPSO_LE;
        tradeData_secondCCy.Book = productData.BOOK;
        tradeData_secondCCy["keyword.RT_SourceOfFunds"] =
          productCategory.CATEGORY;
        tradeData_secondCCy.TradeDate = strftime(
          "%Y%m%d",
          new Date(tradeData_secondCCy.TradeDate)
        );
        tradeData_secondCCy.SettlementDate = strftime(
          "%Y%m%d",
          new Date(tradeData_secondCCy.SettlementDate)
        );
       

        if (
          tradeData_secondCCy["keyword.RT_TravelDate"] !== null &&
          tradeData_secondCCy["keyword.RT_TravelDate"] !== undefined &&
          tradeData_secondCCy["keyword.RT_TravelDate"] !== ""
        ) {
          tradeData_secondCCy["keyword.RT_TravelDate"] = strftime(
            "%Y%m%d",
            new Date(tradeData_secondCCy["keyword.RT_TravelDate"])
          );
        } else {
          tradeData_secondCCy["keyword.RT_TravelDate"] = "";
        }
        let newPrimAmount1 = tradeData_secondCCy.PrimaryAmount;
        let newSecAmount1 = tradeData_secondCCy.SecondaryAmount;
        let newPrimCCY1 = tradeData_secondCCy.PrimaryCurrency;
        let newSecCCY1 = tradeData_secondCCy.SecondaryCurrency;
        let newRate = await exchange_rate3(
          tradeData_secondCCy.PrimaryCurrency,
          tradeData_secondCCy.SecondaryCurrency
        );
        if (newRate == 0) {
          tradeData_secondCCy.PrimaryCurrency = newSecCCY1;
          tradeData_secondCCy.SecondaryCurrency = newPrimCCY1;
          tradeData_secondCCy.PrimaryAmount = newSecAmount1;
          tradeData_secondCCy.SecondaryAmount = newPrimAmount1;
        }

        if (tradeData_secondCCy.SecondaryCurrency == findTrade.WE_SELL_CCY) {
          tradeData_secondCCy.BuySell = "BUY"
        } else {
          tradeData_secondCCy.BuySell = "SELL"
        }

        // roundTradeAmounts(tradeData_secondCCy);

        await dataUploader.json2Csv_secondCCy(tradeData_secondCCy);
      }

      await Trade.update(
        {
          STATUS: 1,
        },
        { where: { ID: request.params.tradeId } }
      );
    } else {
      await Trade.update(
        { STATUS: request.body.status },
        { where: { ID: request.params.tradeId } }
      );
    }
    if(request.body.status ==2){
      return response.status(400).send({
        message: "Trade Rejected successfully",
      });
    }if(request.body.status ==1){
      return response.status(200).send({
        message: "Trade Approved successfully",
      });
    }else {
       return response.status(200).send({
      message: "Trade updated successfully",
    });
    }
    //console.log("Current Status" , request.body.status)
  } catch (error) {
    console.error("Update trade error", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const deleteTrade = async (request, response) => {
  try {
    const trade = await Trade.findOne({
      where: { ID: request.params.tradeId },
    });
    if (trade == null) {
      return response.status(404).send({
        message: " Kindly Provide Valid details",
      });
    }
    await trade.destroy();

    return response.status(200).send({
      message: "Trade deleted successfully",
    });
  } catch (error) {
    console.error("Error delete trade", error);
    return response.status(400).send({
      message: `Something went wrong`,
    });
  }
};

const accDetails = async (request, response) => {
  try {
    const acc_no = request.params.account_number;
    const result = await getAccountDetails(acc_no);
    if (!result) {
      return response.status(404).send({
        message: "Record not found",
      });
    }
    return response.status(200).send({
      data: result,
    });
  } catch (error) {
    console.error("Show trade error", error);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const filterTrade = async (request, response) => {
  const loginUser = await User.findOne({
    where: { USERNAME: request.headers.username },
  });
 
  try {
    const where = {};
      where.BOOK =loginUser.BOOK; // Restric view to only your country Olatunji Bakare

    if (loginUser.ROLE_ID == 1) {  // makers should only see their own trades Olatunji Bakare
        where.USERNAME = request.headers.username;
    }  
      
    if (request.query.status) {
      where.STATUS = request.query.status;
    }

    if (request.query.search) {
      where[Op.or] = [
        {
          CUSTOMER_REF: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("CUSTOMER_REF")),
            "LIKE",
            request.query.search + "%"
          ),
        },
        {
          ACC_NO: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("ACC_NO")),
            "LIKE",
            request.query.search + "%"
          ),
        },
      ];
    }

    if (request.query.tradeDate) {
      const formattedDate = moment(request.query.tradeDate).format(
        "YYYY-MM-DD"
      );

      where.TRADE_DATE = sequelize.where(
        sequelize.fn("TRUNC", sequelize.col("TRADE_DATE")),
        "= DATE",
        formattedDate
      );
    }

    if (request.query.productId) {
      where.PRODUCT_ID = request.query.productId;
    }

    const page = Number(request.query.page) || 1;
    const filter = await TradeDetails.findAndCountAll({
      where,
      limit: 15,
      offset: 15 * (page - 1),
      order: [["CUSTOMER_REF", "DESC"]],
    });
    if (!filter) {
      return response.status(404).send({
        message: "No records found",
      });
    }
    return response.status(200).json(filter);
  } catch (e) {
    console.error(`Filter trade error`, e);
    return response.status(400).send({
      message: "Something went wrong",
    });
  }
};

const tradeApproved = async (tradeData, productData, username) => {
  const url = apiConfig.app_post_url;

  const tradeDate = moment(tradeData.TRADE_DATE).format("DD-MM-YYYY");
  const narration = `${tradeData.PRODUCT_NAME} - ${tradeData.ACC_NO} - ${tradeData.ACC_NAME} - ${tradeData.CUSTOMER_REF} `;
  //sequelize.literal("'BC-'|| \"BRANCH\"")
  const body = {
    msg_id: 'CLP'+ tradeData.CUSTOMER_REF+ Date.now(),
    channel_code: apiConfig.channel_code,
    tran_narration: narration,
    user_loginid: username,
    tran_date: tradeDate,

    DataEntries: [
      {
        txn_indicator: "D",
        txn_accountno: tradeData.ACC_NO,
        tran_amount: tradeData.DEBIT_AMOUNT.toString(),
        tran_remark: narration,
        gl_branchcode: "",
        gl_ccycode: "",
        tran_code: "",
      },
      {
        txn_indicator: "C",
        txn_accountno: productData.GL,
        tran_amount: tradeData.DEBIT_AMOUNT.toString(),
        tran_remark: narration,
        gl_branchcode: tradeData.BRANCH,
        gl_ccycode: tradeData.ACC_CURRENCY,
        tran_code: "",
      },
    ],
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: apiConfig.api_key,
    },
  };

  const requestLogPath = path.resolve(
    path.join(
      __dirname,
      "..",
      "api-logs",
      `${tradeData.CUSTOMER_REF}${Date.now()}_request.json`
    )
  );
  const responseLogPath = path.resolve(
    path.join(
      __dirname,
      "..",
      "api-logs",
      `${tradeData.CUSTOMER_REF}${Date.now()}_response.json`
    )
  );

  

  try {
    writeFileSync(requestLogPath, JSON.stringify(body));
     const response = await fetch(url, options).then((res) => res.json());
     writeFileSync(responseLogPath, JSON.stringify(response));
     if (response.response_code !== "00") {
      if (response.flex_reply_msg === "") {
        return {
          //message: "Transaction posting failed, check logs",
          message: response.err_message,
          context: response.response_message,
        };
      }else {
        return {
          message: response.flex_reply_msg,
          context: response.response_message,
        }
      }
       
     }

    return null;
  } catch (e) {
    console.error(e);
    writeFileSync(
      responseLogPath,
      JSON.stringify({
        message: "Error received in response",
        error: e.message,
      })
    );
    return {
      message: "Unable to generate posting",
    };
  }
};

const roundTradeAmounts = (tradeData) => {
  tradeData.PrimaryAmount = round(tradeData.PrimaryAmount, 2) || "";
  tradeData.SecondaryAmount = round(tradeData.SecondaryAmount, 2) || "";
  tradeData.SpotRate = round(tradeData.SpotRate, 4) || "";
  tradeData.TradeNotional = round(tradeData.TradeNotional, 4) || "";
};

module.exports = {
  createTrade,
  getTrade,
  getTrades,
  updateTrade,
  deleteTrade,
  accDetails,
  filterTrade,
};
