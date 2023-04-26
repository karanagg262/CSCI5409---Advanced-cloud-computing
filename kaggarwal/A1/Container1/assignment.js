const express = require('express');
const cors = require('cors');
const fs = require('fs');
var request = require('request');

const app = express();

app.use(cors());
app.use(express.json()); 

app.post('/checksum', (req, res) => {
    data = req.body;

    filepath =  data.file;

    if(!filepath){
        var output = {
            "file": filepath,
            "error": "Invalid JSON input."
        } ;
        res.send(output);
    }
    if(filepath){
        var filename = "/inputfile/" + filepath;
        fs.readFile(filename, (err, data) => {
            if (err) {
                var output = {
                    "file": filepath,
                    "error": "File not found."
                } ;
                res.send(output);
            };

            if(!err){
                request.post('http://container2:5001/mdhash',{json: req.body}, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.send(body);
                    }
                });

            }
        });
    }
});

app.listen(5000, () => {
});