const express = require("express");
const router = express.Router({});
router.get('/', async (_req, res, _next) => {
    console.log('In healthcheck');
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };

    try {
        console.log("healthcheck",healthcheck )
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        console.log('Error in Healthcheck', error);
        res.status(503).send();
    }
});
// export router with all routes included
module.exports = router;