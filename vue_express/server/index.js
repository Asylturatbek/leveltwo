const express = require('express');
const cors = require('cors')

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

const posts = require('./routes/api/posts.js')

app.use('/api/posts', posts)

// handle production
if(process.env.NODE_ENV	=== 'production'){
	//static folder
	app.use(express.static(__dirname + '/public'))

	//handle spa
	app.get(/.*/, (req, res) => {
		res.sendFile(__dirname + '/public/index.html')
	})
}


const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`server started on port ${port}`)
})