const express = require('express');
const cors = require('cors');
var request = require('request');

const app = express();
app.use(cors());
app.use(express.json()); 

request.post('https://btss3khqtc.execute-api.us-east-1.amazonaws.com/default/serverless_script',{json: {
    "arnBroker": "arn:aws:states:us-east-1:022210240442:stateMachine:MyStateMachine",
    "arnEngine": "arn:aws:lambda:us-east-1:022210240442:function:mqttlambda",
    "apiURL": "https://rksshzn8kc.execute-api.us-east-1.amazonaws.com/testing",
    "bannerId": "B00912580",
    "email": "kr284229@dal.ca"
  }}, function (error, response, body) {
    console.log(body);
});
