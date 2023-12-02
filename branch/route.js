const authenticate = require('../middleware/authentication');
const   branchSettleService = require('./service');
const express = require('express');
const router = express.Router();



router.post('/branchsettles/create',authenticate([0]),branchSettleService.createBranchSettle); 
router.get('/branchsettles',authenticate([0,1]), branchSettleService.getBranchsSettle);
router.get('/branchsettles/search',authenticate([0,1]), branchSettleService.getNostroAccounts);//@mayopo
router.get('/branchsettle/:branchId',authenticate([0]), branchSettleService.getBranchSettle);
router.put('/branchsettle/:branchId', authenticate([0]), branchSettleService.updateBranchSettle);
router.delete('/branchsettle/:branchId',authenticate([0]), branchSettleService.deleteBranchSettle);




module.exports = router;