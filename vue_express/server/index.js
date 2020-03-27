const express = require('express');
const cors = require('cors')

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

const posts = require('./routes/api/posts.js')

app.use('/api/posts', posts)

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`server started on port ${port}`)
})