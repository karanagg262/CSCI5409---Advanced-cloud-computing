const express = require('express');
const cors = require('cors');
const NodeRSA = require('node-rsa');
var request = require('request');
const http = require('http');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json()); 
const key = new NodeRSA({b: 512});

process.env.AWS_ACCESS_KEY_ID = 'ASIAQKK6VL65P46M656T';
process.env.AWS_SECRET_ACCESS_KEY = 'H5d0rtbXjFvU2JQvjtireRWz349xXg1znwxt1NbT';
process.env.AWS_SESSION_TOKEN = 'FwoGZXIvYXdzEGwaDEQoLKjQWSVc175NwiLAATtZoDaRp1F9LjOtCYCSuM5Gk8UeiBWxNsg2JAr9HJ4CIDWWNe3mzIm58o+kZLjspphHsO6P/CFSXxBJxukf/9fxKJUGV/dDnifVww0eTcRort6gsTbFLsmm1X5xIXYlEM0etmbYyTDlivzYuIJ0z2teKgWZ96gMdhtv9iVsnNhoVuwAWT337HKuMtskJNgSJnHg3MCL7I7OygZHs9IDFd+jfYi0JuM4hqIxZAVUiuxAHQn/Lqq3dtKOJeGkZHcvpijtnM+gBjItOoyXiE1LXyOarkAjKfHm9++gFJq78mkEiIhRH/09wiaOS9iOSwyXDj+BYqWh';

request.post('http://44.202.179.158:8080/start',{json: {
    "banner": "B00912580",
    "ip": "54.210.199.30"
  }}, function (error, response, body) {
    console.log(body);
});

app.post('/decrypt', (req, res) => {
    response = req.body; 
    message = response.message;
    const key = new NodeRSA();   
    const data = fs.readFileSync('private_key.txt');
    key.importKey(data.toString());
    const postData = JSON.stringify({
        "response": key.decrypt(message).toString()
      });    
    res.send(postData);
});

app.post('/encrypt', (req, res) => {
    response = req.body; 
    message = response.message;
    const key = new NodeRSA();   
    const data = fs.readFileSync('public_key.txt');
    key.importKey(data.toString());
    const postData = JSON.stringify({
        "response": key.encrypt(message, ['Base64'], ['Base64'])
      });
    res.send(postData);
});

app.listen(80);