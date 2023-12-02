const Rate = require("../models/rate");
const { Op } = require("sequelize");
const Trade = require("../models/trade");
const moment = require("moment");
const calculation1 = async (pri_Ccy, sec_Ccy) => {
  try {
    const conversionRate = await Rate.findOne({
      where: {
        [Op.and]: [{ PRIMARY_CCY: pri_Ccy }, { SECONDARY_CCY: sec_Ccy }],
      },
    });
    return conversionRate.RATE;
  } catch (e) {
    console.log(e);
  }
};

const calculation2 = async (pri_Ccy, ref_Ccy) => {
  try {
    const conversionRate = await Rate.findOne({
      where: {
        [Op.and]: [{ PRIMARY_CCY: pri_Ccy }, { SECONDARY_CCY: ref_Ccy }],
      },
    });
    return conversionRate.RATE;
  } catch (e) {
    console.log(e);
  }
};

const conversion1 = async (we_sell, rate1) => {
  try {
    const debitAmt = we_sell * rate1;
    return debitAmt;
  } catch (e) {
    console.log(e);
  }
};

const conversion2 = async (we_sell, rate2) => {
  try {
    const refAmt = we_sell * rate2;
    return refAmt;
  } catch (e) {
    console.log(e);
  }
};

const round = (number, significantDigits) => {
  if (!number) return number;
  return (
    Math.round(Number(number) * 10 ** significantDigits) /
    10 ** significantDigits
  );
};

const exchange_rate3 = async (ref_ccy, debit_ccy) => {
  const rate = await Rate.findOne({
    where: { PRIMARY_CCY: ref_ccy, SECONDARY_CCY: debit_ccy },
    attributes: ["RATE", "CREATED_AT", "UPDATED_AT"],
    order: [["CREATED_AT", "DESC"]],
  });
  return rate?.RATE || "";
};
module.exports = {
  calculation1,
  calculation2,
  conversion1,
  conversion2,
  round,
  exchange_rate3,
};
