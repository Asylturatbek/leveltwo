const { Router } = require('express')
const UserModel = require('../models/user')
const router = Router()

//api endpoint for listing all users
router.get('/allusers', async (req, res) => {
	try {
		UserModel.find((err, users) => {
			if(err) {
				res.status(400).send(err)
			}
			res.send(users)
		})
	} catch(e) {
		// statements
		res.status(400).send(err)
	}
})

//api endpoint for deleting the users
router.post('/deleteuser', async (req, res) => {
	try {
		UserModel.deleteOne(req.body, function(err) {

			if(err) {
				res.status(400).send(err)
			}
			res.send('successfully deleted')
		});

	} catch(e) {
		// statements
		console.log(e);
	}
})

module.exports = router