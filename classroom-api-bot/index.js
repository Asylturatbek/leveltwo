const express = require('express')
const app = express()

const { SCOPES, listCourses } = require('./classroom.js')

app.get('/', (req, res) => {
	res.send('You are in home page')
})

app.listen(5000, ()=> {
	console.log('Listening on port 5000')
})