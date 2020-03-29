const { Router } = require('express')
const UserModel = require('../models/user')
const router = Router()
const { mongooseToObj, multipleMongooseToObj} = require('../config/helper/accessProblemSolution.js')
const compressArray = require('../config/helper/uniqueArrayAndNumbers.js')



router.get('/', async (req, res) => {

    if (req.isAuthenticated()) {
        console.log('You are authenticated')
        const auth_user = mongooseToObj(req.user)
        res.render('index', {user: auth_user}) 
        console.log(req.session)           

    } else {
    	console.log('You are not authenticated')

        console.log(req.session)
    	res.render('index')
    }


})

router.get('/login', async(req, res) => {
	// let user = req.session.user; 
    if (req.isAuthenticated()) {
    	res.redirect('/')
    } else {
    	res.render('login')
    }
})

router.get('/loginstudent', async(req, res) => {
    console.log(req.flash())
    res.render('loginStudents')
})

router.get('/register', async(req, res) => {
	res.render('register')
})




router.get('/departaments', async (req, res) => {
    const departments = await UserModel.find({} , function (err, docs) {
        if(err) {
            console.log(err)
        }
        return docs
    })

    const array = []
    for(element of departments){
        array.push(element.department)
    }
    console.log(array)

    const compressedArray = compressArray(array)
    console.log(compressedArray);

    res.render('departaments', {
        title: 'Neobis departaments', unique: compressedArray
    })
})

router.get('/dep/:name', async (req, res) => {
    let depname = req.params.name
    const nodejs = await UserModel.find({department:depname} , function (err, docs) {
        if(err) {
            console.log(err)
        }
        return docs
    })
    const nodejs_users = multipleMongooseToObj(nodejs)
    console.log(nodejs_users)

    res.render('departament', {nodejs: nodejs_users})
})

router.get('/thisstudent/:id', async (req, res) => {
	// let user = req.session.user;
    let id = req.params.id
	console.log(id+'don know nothing')
    const foundStudent = await UserModel.findById(id, (err, user) => {
        return user
    })
    const sendStudent = mongooseToObj(foundStudent);
    res.render('student', {student: sendStudent})
})


router.post('/missedStandup', (req, res) => {
    let hp = req.body.healthpoint
    hp = hp - 10
    res.redirect('/')
})

module.exports = router