var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var redis = require("redis"),
client = redis.createClient(process.env.REDIS_URL);

var sessionLength = 300;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

client.on("error", function (err) {
  console.log("Error " + err);
});

app.post('/stroke', function (req, res) {
  client.get("last-stroke", function(err, reply) {
    var lastStroke = parseInt(reply);
    if(Date.now() - lastStroke > sessionLength * 1000) {
      client.del("strokes", function(err, reply) {
        client.hset("strokes", req.body.id, req.body.points);
        client.set("last-stroke", Date.now());
      });
    } else {
      client.hset("strokes", req.body.id, req.body.points);
      client.set("last-stroke", Date.now());
    }
  });
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

app.listen(app.get('port'), function () {
  console.log('listening on port 3000');
});