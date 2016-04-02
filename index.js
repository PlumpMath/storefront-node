var express = require('express');
var app = express();
var redis = require("redis"),
client = redis.createClient();

app.use(express.static(__dirname + '/public'));

client.on("error", function (err) {
  console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

app.get('/data', function (req, res) {
  client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    var r = ""
    replies.forEach(function (reply, i) {
      r += (i + ": " + reply + " ");
    });
    res.send(r);
  });
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});