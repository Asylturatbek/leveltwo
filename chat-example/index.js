const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
	console.log('a user connected')
	
	socket.on('chat message', function(mesfromclie){
		io.emit('chat message', mesfromclie)
	})

	socket.on('disconnect', function(){
		console.log('user disconnected')
	})
})

http.listen(PORT, function(){
	console.log(`listening to ${PORT}...`)
})