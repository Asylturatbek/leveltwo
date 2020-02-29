const app = require('express')();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 5000;

app.get('/', function(req, res){
	res.send('<h1>Hello World</h1>')
})

http.listen(PORT, function(){
	console.log(`listening to ${PORT}...`)
})