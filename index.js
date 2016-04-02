var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var redis = require("redis"),
client = redis.createClient();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

client.on("error", function (err) {
  console.log("Error " + err);
});

app.post('/stroke', function (req, res) {
  client.hset("strokes", req.body.id, req.body.points);
});

app.get('/data', function (req, res) {
  client.hgetall("strokes", function (err, reply) {
    var r = "";
    for(k in reply) {
      r += k + "," + reply[k] + "\n";
    }
    res.send(r)
  });
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});