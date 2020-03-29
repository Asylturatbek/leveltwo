const { Router } = require('express')
const UserModel = require('../models/user')
const router = Router()
const passport = require('passport');

router.get('/loginGoogle', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/loginGoogle/redirect', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/loginstudent'
}));

router.get('/success', (req, res) => {
	res.render('Notstudent')
})





module.exports = router