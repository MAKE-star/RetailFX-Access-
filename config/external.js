module.exports = {
  channel_code: "CALYPSO",
  bank_code: "044",
  api_key: "CALo4fA4qFFCTFswX7OrA==",
  app_post_url: "http://10.111.23.13:8004/postingserviceng/v1/accounts/transfers/batchpost",
  app_inq_url: "http://10.111.23.13:8004/AccessBankEnquiryServices/v1/GetAccountDetails",
  //dtupfilepath: "app/calypso/interfaces/cduf/incoming/",
  //dtupfilepath: "/home/alinux/app/calypso/interfaces/cduf/incoming/"
  dtupfilepath: "C:/Workdir/dtup",
  exemptedUsernames: ['admin', 'Maker','Checker','adminGH','makerGH','checkerGH'],
  loginsuffix: "@accessbanktest.com"
};
