
var http = require("https");
var request = require("request");


/**
 * responseCallback - callback to routes containing status and body of response
 * @callback responseCallback
 * @param {number} status - http status code
 * @param {Object} body - array of rows or error object
 */

/**
 * Creates a new TimeseriesController - facilitate connections between routes and the database
 * @constructor
 */
function TimeseriesController() {
}

/**
 * Initializes the database schema
 * @param {responseCallback} callback
 */
TimeseriesController.prototype.getAllData = function (callback) {
    var self = this;

    var options = {
        method: 'POST',
        url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
        headers:
        {
            'predix-zone-id': 'c50984cf-4e15-49cf-9884-c839ee37ee62',
            authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiIyMGQxNjYyODRlOWQ0Y2U1YTA5ZjRjNGMxMjVjYjM2ZCIsInN1YiI6Im1zdS1jbGllbnQiLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiLCJvcGVuaWQiLCJ1YWEubm9uZSIsInByZWRpeC1hc3NldC56b25lcy44YzZmZGQ3Ni03OGIyLTQ5ZTEtODRkOS0zMjYyZDY5MjVhOGEudXNlciIsInRpbWVzZXJpZXMuem9uZXMuYzUwOTg0Y2YtNGUxNS00OWNmLTk4ODQtYzgzOWVlMzdlZTYyLmluZ2VzdCIsInRpbWVzZXJpZXMuem9uZXMuYzUwOTg0Y2YtNGUxNS00OWNmLTk4ODQtYzgzOWVlMzdlZTYyLnF1ZXJ5IiwidGltZXNlcmllcy56b25lcy5jNTA5ODRjZi00ZTE1LTQ5Y2YtOTg4NC1jODM5ZWUzN2VlNjIudXNlciJdLCJjbGllbnRfaWQiOiJtc3UtY2xpZW50IiwiY2lkIjoibXN1LWNsaWVudCIsImF6cCI6Im1zdS1jbGllbnQiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6Ijg2NGViMTBmIiwiaWF0IjoxNDkyMDc0OTEwLCJleHAiOjE0OTIxMTgxMTAsImlzcyI6Imh0dHBzOi8vNmY0Mjk0NTEtM2E4OS00Y2FjLThhNzMtNjRkZDZmMGM2ZGRmLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNmY0Mjk0NTEtM2E4OS00Y2FjLThhNzMtNjRkZDZmMGM2ZGRmIiwiYXVkIjpbInVhYSIsInByZWRpeC1hc3NldC56b25lcy44YzZmZGQ3Ni03OGIyLTQ5ZTEtODRkOS0zMjYyZDY5MjVhOGEiLCJvcGVuaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmM1MDk4NGNmLTRlMTUtNDljZi05ODg0LWM4MzllZTM3ZWU2MiIsIm1zdS1jbGllbnQiXX0.hH-Waf6vhnWlC3DqP10dmrUCuWhgIKkxNlXZCFudNCkTywYMxYL2EIxko2sm7UrTONQ4-Ttbp6ThVB7waJ5vaXHen2VNIAugwQBwCQvu7pt3W_Z5nIJzzsL1zCS2-T6Kudr3h4zOAyqOrFLxUF2EDbzf4luwiF-Ujpgn_geW9pfeVKnPXNkqXKEghwu1wp3PBcMaXRNFjJKFbdhWcaxM21slLwgL3O0oqYRfRgJpDTeyplYBGb3Sma4kLueqrJ1maZJRfQ6G2T8lDkKAlE8d-SVsylmjpFNSi_BR83pUa-j7ARQ_nuU1VvcCrakino89RebQqmOlL3_EKn1v7ncdvA'
        },
        body: { start: "30mi-ago", tags: [{ name: 'test1' }] },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        return callback(200, convertToChartFormat(body));
    });
};

/**
 * Initializes the database schema
 * @param {responseCallback} callback
 */
TimeseriesController.prototype.sumAllData = function (callback) {
    var self = this;

    var options = {
        method: 'POST',
        url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
        headers:
        {
            'predix-zone-id': 'c50984cf-4e15-49cf-9884-c839ee37ee62',
            authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiIyMGQxNjYyODRlOWQ0Y2U1YTA5ZjRjNGMxMjVjYjM2ZCIsInN1YiI6Im1zdS1jbGllbnQiLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiLCJvcGVuaWQiLCJ1YWEubm9uZSIsInByZWRpeC1hc3NldC56b25lcy44YzZmZGQ3Ni03OGIyLTQ5ZTEtODRkOS0zMjYyZDY5MjVhOGEudXNlciIsInRpbWVzZXJpZXMuem9uZXMuYzUwOTg0Y2YtNGUxNS00OWNmLTk4ODQtYzgzOWVlMzdlZTYyLmluZ2VzdCIsInRpbWVzZXJpZXMuem9uZXMuYzUwOTg0Y2YtNGUxNS00OWNmLTk4ODQtYzgzOWVlMzdlZTYyLnF1ZXJ5IiwidGltZXNlcmllcy56b25lcy5jNTA5ODRjZi00ZTE1LTQ5Y2YtOTg4NC1jODM5ZWUzN2VlNjIudXNlciJdLCJjbGllbnRfaWQiOiJtc3UtY2xpZW50IiwiY2lkIjoibXN1LWNsaWVudCIsImF6cCI6Im1zdS1jbGllbnQiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6Ijg2NGViMTBmIiwiaWF0IjoxNDkyMDc0OTEwLCJleHAiOjE0OTIxMTgxMTAsImlzcyI6Imh0dHBzOi8vNmY0Mjk0NTEtM2E4OS00Y2FjLThhNzMtNjRkZDZmMGM2ZGRmLnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiNmY0Mjk0NTEtM2E4OS00Y2FjLThhNzMtNjRkZDZmMGM2ZGRmIiwiYXVkIjpbInVhYSIsInByZWRpeC1hc3NldC56b25lcy44YzZmZGQ3Ni03OGIyLTQ5ZTEtODRkOS0zMjYyZDY5MjVhOGEiLCJvcGVuaWQiLCJ0aW1lc2VyaWVzLnpvbmVzLmM1MDk4NGNmLTRlMTUtNDljZi05ODg0LWM4MzllZTM3ZWU2MiIsIm1zdS1jbGllbnQiXX0.hH-Waf6vhnWlC3DqP10dmrUCuWhgIKkxNlXZCFudNCkTywYMxYL2EIxko2sm7UrTONQ4-Ttbp6ThVB7waJ5vaXHen2VNIAugwQBwCQvu7pt3W_Z5nIJzzsL1zCS2-T6Kudr3h4zOAyqOrFLxUF2EDbzf4luwiF-Ujpgn_geW9pfeVKnPXNkqXKEghwu1wp3PBcMaXRNFjJKFbdhWcaxM21slLwgL3O0oqYRfRgJpDTeyplYBGb3Sma4kLueqrJ1maZJRfQ6G2T8lDkKAlE8d-SVsylmjpFNSi_BR83pUa-j7ARQ_nuU1VvcCrakino89RebQqmOlL3_EKn1v7ncdvA'
        },
        body:
        {
            start: "60mi-ago",
            tags:
            [{
                name: 'test1',
                aggregations: [{ type: 'sum', interval: '1h' }]
            }]
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        return callback(200, body.tags[0].results[0].values[0][1]);
    });
};

// {
//   "id": 2,
//   "data": {
//     "name": "Output vs. Capacity",
//     "values": [
//       [1, 2],
//       [2, 1],
//       [3, 4],
//       [4, 3.9],
//       [5, 4.5],
//       [6, 4.2],
//     ],
//     "max": 10,
//     "min": 0,
//     "threshold": 5.9
//   }
// }

function convertToChartFormat(data) {
    var chartData = {
        "max": 10,
        "min": 0,
        "threshold": 5.9
    };

    chartData.name = data.tags[0].name;
    console.log(data.tags[0].name)

    chartData.values = [];
    console.log(data.tags[0].results[0].values.length)

    for (var i = 0, len = data.tags[0].results[0].values.length; i < len; i++) {
        // console.log(data.tags[0].results[0].values[i])
        var dataArray = []
        dataArray.push(data.tags[0].results[0].values[i][0])
        dataArray.push(data.tags[0].results[0].values[i][1])
        chartData.values.push(dataArray)
    }

    console.log(JSON.stringify(chartData))

    chartDataBig = {}
    chartDataBig.data = chartData;
    chartDataBig.id = 2;

    return chartDataBig;
}




module.exports = TimeseriesController;