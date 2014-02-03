var express = require('express');

var app = express();

app.get('/', function(req, res){
    res.sendfile('./Sim/index.html');
});

app.get('/sprite.js', function(req, res){
    res.sendfile('./Sim/sprite.js');
});

app.listen(3000);
console.log('Listening on port 3000');
