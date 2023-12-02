const authenticate = require("../middleware/authentication");
const Roles = require("../models/roles");
const tradeService = require("./service");
const express = require("express");
const router = express.Router();

router.post("/trades/create", authenticate([1]), tradeService.createTrade); //maker
router.get("/trades", authenticate([1, 2]), tradeService.getTrades); //checker
router.get("/trades/:tradeId", authenticate([1, 2]), tradeService.getTrade); //maker and checker
router.put(
  "/trades/edit/update/:tradeId",
  authenticate([1, 2]),
  tradeService.updateTrade
); // maker and checker
router.delete(
  "/trades/edit/delete/:tradeId",
  authenticate([1]),
  tradeService.deleteTrade
); //maker
router.get(
  "/account-details/:account_number",
  authenticate(),
  tradeService.accDetails
);
router.get("/filter", authenticate(), tradeService.filterTrade);

module.exports = router;
