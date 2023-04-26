const express = require('express');
const cors = require('cors');
const s3 = require('aws-sdk');
var request = require('request');
const http = require('http');

const app = express();
process.env.AWS_ACCESS_KEY_ID = 'ASIAQKK6VL65M6SMUHO2';
process.env.AWS_SECRET_ACCESS_KEY = 'KnzIRdYFfzxxtLoCw6t9+vAN86uhmO2okGVBcfFi';
process.env.AWS_SESSION_TOKEN = 'FwoGZXIvYXdzEIn//////////wEaDCayHBobQvbzAB//3yLAAaqykvVDqJZO5ddEXPxszoM8L4RKeuDrNTIYW8/03/vZavZQKFMwL/qF4c+4qqqoLS25mf8DrKDpoFE/KRnWzDRNYRojwJvjiX4NAmlN/tX8KJFM9oqpkd/0jv58M+29IVpZrySBkdqgTmOS1c56wUs+eMJYcAB2bhgH4U+9h7LhMfFeVhra9d6a/Be8xN2YMevLKsmhzuiyhKFcAqjf561W17DJDoGGl1h4I8xTx5K/by72ezhU4lNnZplc9u+7LCj9heWfBjItHtGTdC/EAePyXE5EqGnm9n1Yej13qN9Xyj5yb86df5TcvGtYjofsMUZSjhSY'; 
const db = new s3.S3({
    aws_access_key_id: 'ASIAQKK6VL65M6SMUHO2',
    aws_secret_access_key: 'KnzIRdYFfzxxtLoCw6t9+vAN86uhmO2okGVBcfFi',
    aws_session_token: 'FwoGZXIvYXdzEIn//////////wEaDCayHBobQvbzAB//3yLAAaqykvVDqJZO5ddEXPxszoM8L4RKeuDrNTIYW8/03/vZavZQKFMwL/qF4c+4qqqoLS25mf8DrKDpoFE/KRnWzDRNYRojwJvjiX4NAmlN/tX8KJFM9oqpkd/0jv58M+29IVpZrySBkdqgTmOS1c56wUs+eMJYcAB2bhgH4U+9h7LhMfFeVhra9d6a/Be8xN2YMevLKsmhzuiyhKFcAqjf561W17DJDoGGl1h4I8xTx5K/by72ezhU4lNnZplc9u+7LCj9heWfBjItHtGTdC/EAePyXE5EqGnm9n1Yej13qN9Xyj5yb86df5TcvGtYjofsMUZSjhSY',
    region_name: 'us-east-1'
});
const bucket_name = 'b00912580assignment2';

app.use(cors());
app.use(express.json()); 

request.post('http://52.91.127.198:8080/start',{json: {
    "banner": "B00912580",
    "ip": "54.237.7.61"
  }}, function (error, response, body) {
    console.log(body);
});


app.post('/storedata', (req, res) => {
    data = req.body;
    filepath =  data.data;
    db.upload({
        Bucket: bucket_name,
        Key: 'data.txt',
        Body: filepath,
        ACL: 'public-read'
    }, function(error, data){
        if(error){
            console.log(error);
        }
        const postData = JSON.stringify({
            "s3uri": data.Location
          });
        res.send(postData);
    });
});

app.post('/appenddata', (req, res) => {
    data = req.body;
    filepath =  data.data;
    db.getObject({
        Bucket: bucket_name,
        Key: 'data.txt'
    }, function(error, ans){
        if(error){
            console.log(error);
        }
        append_data = ans.Body.toString()+filepath;
        
        db.upload({
            Bucket: bucket_name,
            Key: 'data.txt',
            Body: append_data,
            ACL: 'public-read'
        }, function(error, data){
            if(error){
                console.log(error);
            }
            console.log(data);
            res.sendStatus(200);
        });
    });
});

app.post('/deletefile', (req, res) => {
    data = req.body;
    filepath =  data.s3uri;
    parts = filepath.split("/");
    db.deleteObject({
        Bucket: bucket_name,
        Key: parts[3],
    }, function(error, data){
        if(error){
            console.log(error);
        }
        console.log(data);
        res.sendStatus(200);
    });
});

app.listen(80);