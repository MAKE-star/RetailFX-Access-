const apiConfig = require("../config/external");

const GetAccountDetails = async (acc_no) => {
  try {
    const url = apiConfig.app_inq_url;
      
    const requestPayload = {
      channel_code: apiConfig.channel_code,
      account_no: acc_no,
      bank_code: apiConfig.bank_code,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json",
        Authorization: apiConfig.api_key,
      },
    };

    
    try {  ///commented to use dummy Api //@mayopo
      const response = await fetch(url, options);
      return response.json();
    } catch(error) {
      console.error("Error fetching account details");
      return null;
    }
  } catch (error) {
    console.error("GetAccountDetails error", error);
  }
};



/*
    if (acc_no == 9876543210) {
      return jsonResponse1;
    }
    if (acc_no == 1023456789) {
      return jsonResponse2;
    }
    if (acc_no == 1122334455) {
      return jsonResponse3;
    }
    if (acc_no == 9988776655) {
      return jsonResponse4;
    }
    if (acc_no == 2007369391) {
      return jsonResponse5;
    }
    if (acc_no == 7086122804) {
      return jsonResponse6;
    }
    if (acc_no == 3025149382) {
      return jsonResponse7;
    }
    if (acc_no == 1012023034) {
      return jsonResponse8;
    }

    return null;
  } catch (error) {
    console.error("GetAccountDetails error", error);
  }
};


const jsonResponse1 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "9876543210",
      account_name: "Adewale Jolayemi",
      net_balance: 30000.0,
      customer_no: "11223344",
      product_name: "PREMIER SAVINGS ",
      email_address: "adewalejolayemi@gmail.com",
      mobile_no: "08037711387",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "USD",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
const jsonResponse2 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "1023456789",
      account_name: "Victoria Johnson",
      net_balance: 27850.0,
      customer_no: "00112233",
      product_name: "PREMIER SAVINGS ",
      email_address: "victoriajohnson@gmail.com",
      mobile_no: "08037711387",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "EUR",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};

const jsonResponse3 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "1122334455",
      account_name: "Oluwafemi Bucknor",
      net_balance: 18700.0,
      customer_no: "87654321",
      product_name: "PREMIER SAVINGS ",
      email_address: "oluwafemibucknor@gmail.com",
      mobile_no: "08037711387",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "GBP",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
const jsonResponse4 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "9988776655",
      account_name: "Charles Okon",
      net_balance: 20000.0,
      customer_no: "76543210",
      product_name: "PREMIER SAVINGS ",
      email_address: "charlesookon@gmail.com",
      mobile_no: "08037711387",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "ZAR",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
const jsonResponse5 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "2007369391",
      account_name: "Adeoye Mayopo",
      net_balance: 3200000.0,
      customer_no: "12345678",
      product_name: "PREMIER SAVINGS ",
      email_address: "adeoyemayopoelijah@gmail.com",
      mobile_no: "2007369391",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "NGN",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
const jsonResponse6 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "7086122804",
      account_name: "Adeyemo Tioluwanimi",
      net_balance: 12800.0,
      customer_no: "01234567",
      product_name: "PREMIER SAVINGS ",
      email_address: "adeoyemayopoelijah@gmail.com",
      mobile_no: "2007369391",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "CHF",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
const jsonResponse7 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "3025149382",
      account_name: "Adegoke James",
      net_balance: 125000000.0,
      customer_no: "00223567",
      product_name: "PREMIER SAVINGS ",
      email_address: "adegokejames@gmail.com",
      mobile_no: "2007369391",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "NGN",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
const jsonResponse8 = {
  response_code: "00",
  response_message: "Successful",
  getcustomeracctsdetailsresp: [
    {
      account_no: "1012023034",
      account_name: "Adegoke James",
      net_balance: 128000.0,
      customer_no: "00223567",
      product_name: "PREMIER SAVINGS ",
      email_address: "adegokejames@gmail.com",
      mobile_no: "09052368651",
      account_officer:
        "748312_STEPHEN  YUBASAN:748312:+(234)8036675488:Yubasan.Stephen@ACCESSBANKPLC.com",
      currency_code: "GBP",
      branch_code: "060",
      branch_name: "ASHAKA CASH CENTRE",
      profitcenter_miscode: "PSN210",
      accountofficer_miscode: "748312",
      team_miscode: "PSN210",
      amountcredit_mtd: 0,
      amountdebit_mtd: 0,
      pnd_status: "N",
      pnc_status: "N",
      frozen_status: "N",
      block_status: "N",
      dormant_status: "N",
      record_status: "O",
      auth_status: "A",
    },
  ],
};
 */

module.exports = GetAccountDetails;