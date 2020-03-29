const { Router } = require('express')
const UserModel = require('../models/user')
const router = Router()
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation.js')

const passport = require('passport');


router.post('/createuser', async (req, res) => {
	
	//validation of creating student
	const {error} = registerValidation(req.body)
	if(error) return res.status(400).send(error.details[0].message)

	//checking if user already exists
	const emailExists = await UserModel.findOne({email: req.body.email});
	
	if(emailExists) {
		req.flash('message_em_exists', 'This email already exists')
		res.redirect('/register')
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		
		const user = new UserModel({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			department: req.body.department
		})
		try{
			const savedUser = await user.save()
			req.flash('message_em_exists', 'Successfully created student')
			res.redirect('/register' )
		} catch(err) {
			res.status(400).send(err)
		}		
	} 

	//hashing the password

})


//api endpoint for updating the users
router.post('/updateuser', async (req, res) => {
	try {
		const founduser = await UserModel.find({email: req.body.email}, (err, doc) => {
			if(err) {
				console.log(err)
			}
		})
		const remaining_karma = founduser[0].karma

		//will check if admin wants to add or subtract karma from user
		if (req.body.plus === true) {

			UserModel.findOneAndUpdate({email: req.body.email}, 
				{karma: remaining_karma + req.body.karma}, 
				{new: true }, 
				function(err, doc) {

				if(err) {
					res.status(400).send(err)
				}
				res.send(doc)
			});			
		} else {
			UserModel.findOneAndUpdate({email: req.body.email}, 
				{karma: remaining_karma - req.body.karma}, 
				{new: true }, 
				function(err, doc) {

				if(err) {
					res.status(400).send(err)
				}
				res.send(doc)
			});			
		}

	} catch(e) {
		// statements
		console.log(e);
	}
})

//LOGIN
router.post('/loginTeamLead', passport.authenticate('local', { 
	failureRedirect: '/login', 
	successRedirect:'/',
	failureFlash: true }), 
	async(req, res, next) => {
	console.log('You are logged in')
	// res.redirect('/')
	// res.send('Logged In!! as a '+user.email)
})

router.get('/logout', (req, res, next) => {
	// if(req.session.user) {
	// 	req.session.destroy(function() {
	// 		res.redirect('/')
	// 	})
	// }
    req.logout();
    req.flash('info', 'You are logged out! Consider loggin in')
    res.redirect('/');
})

module.exports = router