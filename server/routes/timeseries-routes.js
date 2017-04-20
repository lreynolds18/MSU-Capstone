var express = require('express');
var router = express.Router();

var TimeseriesController = require('../controllers/timeseries-controller');
var TimeseriesController = new TimeseriesController();

//base uri : ../api/Timeseries

/************************************************************************************************
*************************************************************************************************/
router.route('/')
    .get(function (req, res) {
        //req.body
        //code is base64 encoded, args is a JSON object
        TimeseriesController.getAllData(function (status, body) {
            console.log("response: " + body);
            res.status(status).contentType('application/json').send(JSON.stringify(body));
        });
    })

router.route('/sum')
    .get(function (req, res) {
        TimeseriesController.sumAllData(function (status, body) {
            console.log("response: " + body);
            res.status(status).contentType('application/json').send(JSON.stringify(body));
        });
    })

module.exports = router;