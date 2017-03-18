const express = require('express');
const bodyParser= require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.listen(6969, function() {
	console.log('das rite')
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res) => {
  console.log(req.body)
})