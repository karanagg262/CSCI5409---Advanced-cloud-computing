const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json()); 

app.post('/mdhash', (req, res) => {
    data = req.body;
    filepath =  data.file;
    
    var filename = "/inputfile/" + filepath;
    fs.readFile(filename, (err, data) => {
        var hash = crypto.createHash("md5").update(data.toString()).digest("hex");
        var output = {
            "file": filepath,
            "checksum": hash
        };
        res.send(output);
    });
});

app.listen(5001, () => {
});