const authenticate = require('../middleware/authentication');
const rateService =  require('./service');
const express = require('express');
const router = express.Router();


router.post('/rate-table/create', authenticate([0]), rateService.createRate);
router.get('/rate-table', authenticate([0,1,2]), rateService.getRates);
router.put('/rate-table/:rateId', authenticate([0]), rateService.updateRate);
router.delete('/rate-table/:rateId', authenticate([0]), rateService.deleteRate);
router.get('/currencies', authenticate([0,1,2]),rateService.getCcy);


module.exports = router;