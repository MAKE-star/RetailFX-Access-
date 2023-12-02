const { Parser } = require("json2csv");
const fs = require("fs");
const Trade = require("../models/trade");
const apiConfig = require("../config/external");
const path = require("path");

const json2Csv_simple = async (data) => {
  try {
    const fields = [
      { label: "Action", value: "NEW", default: "NEW" },
      "ExternalRefId",
      "Counterparty",
      "Book",
      {
        label: "ProductType",
        value: "SimpleTransfer",
        default: "SimpleTransfer",
      },
      "Currency",
      "TradeNotional",
      { label: "SimpleTransferType", value: "PRINCIPAL", default: "PRINCIPAL" },
      { label: "Type", value: "CASH", default: "CASH" },
      { label: "Direction", value: "PAY", default: "PAY" },
      "TradeDate",
      "SettlementDate",
      "TraderName",
      "SalesPerson",
      "Comment",
      "keyword.RT_SourceOfFunds",
      "keyword.RT_PurposeOfFunds",
      "keyword.RT_CustDebitName",
      "keyword.RT_CustDebitAcct",
      "keyword.RT_Branch",
      "keyword.RT_CustDomCRName",
      "keyword.RT_CustDomCRAcct",
    ];

    const trade = [];
    data["keyword.RT_Branch"] = data["keyword.RT_Branch"].toString();
    trade.push(data);
    const json2csvParser = new Parser({
      fields,
      defaultValue: "None",
      includeEmptyRows: true,
      header: true,
    });
    const dtupfilepath = apiConfig.dtupfilepath;
    const csv = (json2csvParser.parse(trade)).replace(/"/g, '');
    const path = dtupfilepath +`SimpleTransfer_${Date.now()}.csv`
    /*
    path.join(
      __dirname,
      "..",
      "calypso",
      `SimpleTransfer_${Date.now()}.csv`
    )*/
    /*const filePath = path.resolve(
      path.join(
        __dirname,
        "..",
        "calypso",
        `SimpleTransfer_${Date.now()}.csv`
      )
    );*/
    fs.writeFile(path, csv + "\r\n", (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully");
        // console.log("The written has the following contents:");
        // console.log(fs.readFileSync("D:\\Workspace\\Projects\\FXretail_BE\\calypso\\simpleFundsTransfer.csv", "utf8"));
      }
    });
  } catch (e) {
    console.log(`Error in data uploader`, e);
  }
};

const json2Csv_secondCCy = async (data) => {
  try {
    const fields = [
      { label: "Action", value: "NEW", default: "NEW" },
      "ExternalRefId",
      "Counterparty",
      "Book",
      "BuySell",
      { label: "ProductType", value: "FX", default: "FX" },
      { label: "ProductSubType", value: "FXSpot", default: "FXSpot" },
      "PrimaryCurrency",
      "PrimaryAmount",
      "SecondaryCurrency",
      "SecondaryAmount",
      "SpotRate",
      { label: "SpotMargin", value: "", default: "" },
      "TradeDate",
      "SettlementDate",
      "TraderName",
      "SalesPerson",
      "Comment",
      "keyword.RT_SourceOfFunds",
      "keyword.RT_PurposeOfFunds",
      "keyword.RT_CustDebitName",
      "keyword.RT_CustDebitAcct",
      "keyword.RT_Branch",
      "keyword.RT_CustDomCRName",
      "keyword.RT_CustDomCRAcct",
      "keyword.RT_FormANo",
      "keyword.RT_PassportNo",
      "keyword.RT_TravelCountry",
      "keyword.RT_ETicketNo",
      "keyword.RT_ApplicationNo",
      "keyword.RT_TravelDate",
    ];

    const trade = [];
    data["keyword.RT_Branch"] = data["keyword.RT_Branch"].toString();
    trade.push(data);
    const json2csvParser = new Parser({
      fields,
      defaultValue: "None",
      includeEmptyRows: true,
      header: true,
    });
    const dtupfilepath = apiConfig.dtupfilepath;
    const csv = (json2csvParser.parse(trade)).replace(/"/g, '');
    const path = dtupfilepath +`FX_SPOT_${Date.now()}.csv`
/*
    const filePath = path.resolve(
      path.join(__dirname, "..", "calypso", `FX_SPOT_${Date.now()}.csv`)
    );
    */
    fs.writeFile(path, csv + "\r\n", (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully");
      }
    });
  } catch (e) {
    console.log(`Error in data uploader`, e);
  }
};

const json2Csv_threeCCy = async (row1, row2) => {
  try {
    const fields = [
      { label: "Action", value: "NEW", default: "NEW" },
      "ExternalRefId",
      "Counterparty",
      "Book",
      "BuySell",
      { label: "ProductType", value: "FX", default: "FX" },
      { label: "ProductSubType", value: "FXSpot", default: "FXSpot" },
      "PrimaryCurrency",
      "PrimaryAmount",
      "SecondaryCurrency",
      "SecondaryAmount",
      "SpotRate",
      { label: "SpotMargin", value: "", default: "" },
      "TradeDate",
      "SettlementDate",
      "TraderName",
      "SalesPerson",
      "Comment",
      "keyword.RT_SourceOfFunds",
      "keyword.RT_PurposeOfFunds",
      "keyword.RT_CustDebitName",
      "keyword.RT_CustDebitAcct",
      "keyword.RT_Branch",
      "keyword.RT_CustDomCRName",
      "keyword.RT_CustDomCRAcct",
      "keyword.RT_FormANo",
      "keyword.RT_PassportNo",
      "keyword.RT_TravelCountry",
      "keyword.RT_ETicketNo",
      "keyword.RT_ApplicationNo",
      "keyword.RT_TravelDate",
    ];

    const trade = [];
    row1["keyword.RT_Branch"] = row1["keyword.RT_Branch"].toString();
    row2["keyword.RT_Branch"] = row2["keyword.RT_Branch"].toString();
    trade.push(row1);
    trade.push(row2);
    const json2csvParser = new Parser({
      fields,
      defaultValue: "None",
      includeEmptyRows: true,
      header: true,
    });
    const dtupfilepath = apiConfig.dtupfilepath;
    const csv = (json2csvParser.parse(trade)).replace(/"/g, '');
    const path = dtupfilepath +`FX_SPOT_${Date.now()}.csv`
 /*   
    const filePath = path.resolve(
      path.join(__dirname, "..", "calypso", `FX_SPOT_${Date.now()}.csv`)
    );
 */   
    fs.writeFile(path, csv + "\r\n", (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully");
        // console.log("The written has the following contents:");
        // console.log(fs.readFileSync("D:\\Workspace\\Projects\\FXretail_BE\\calypso\\foreignFundsTransfer.csv", "utf8"));
      }
    });
  } catch (e) {
    console.log("Error in json2Csv_foreignCCy", e);
  }
};
module.exports = {
  json2Csv_simple,
  json2Csv_secondCCy,
  json2Csv_threeCCy,
};
