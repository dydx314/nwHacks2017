const async = require('async');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const pg = require('pg');

var config = {
  user: 'nwhacks',
  host: 'localhost',
  database: 'salt',
  port: 26257
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ message: 'Yo!'});
});

app.get('/highscore', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  pg.connect(config, function (err, client, done) {
    if (err) {
      res.json({ err: "Cannot connect"});
      done();
      return console.error(err);
    }
    client.query("SELECT name, score FROM salt.leaderboard ORDER BY score DESC LIMIT 10", function (err, result) {
      done();
      if (err) {
        res.json({ err: "Query failed" });
        return console.error(err);
      }
      res.json({ data: result["rows"] });
    });
  });
});

app.post('/submit_score', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  if (!req.body["name"] || !req.body["score"]) {
    res.json({ err: "missing name or score"});
    return;
  }
  pg.connect(config, function (err, client, done) {
    if (err) {
      res.json({ err: "Cannot connect"});
      done();
      return console.error(err);
    }
    client.query("INSERT INTO salt.leaderboard (name, score) VALUES ($1, $2) returning id", [req.body["name"], req.body["score"]], function (err, result) {
      done();
      if (err) {
        res.json({ err: "Query failed" });
        return console.error(err);
      }
      res.json({ ok: "ok" });
    });
  });
});

app.listen(8888);

console.log('Started');
