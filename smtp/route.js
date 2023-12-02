const smtpService = require('./service');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authentication');


router.post('/smtp/create', authenticate([0]), smtpService.createSMTP);
router.get('/smtps', authenticate([0]), smtpService.getAllSMTP);
router.get('/smtp/:id', authenticate([0]), smtpService.getSMTP);
router.put('/smtp/:id', authenticate([0]), smtpService.updateSMTP);
router.delete('/smtp/:id', authenticate([0]), smtpService.deleteSMTP);

module.exports = router
