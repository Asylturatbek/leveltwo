const { Router } = require('express')
const router = Router()
const UserModel = require('../models/user')
const bcrypt = require('bcryptjs')
const sendTelegramMessage = require('../config/helper/sendtelegramMessage.js')


router.get('/makeTeamLead/:id', async(req, res) => {
    let id = req.params.id

    const salt = await bcrypt.genSalt(10);
    //нужно это сделать рандомно генерирующим
    const newpassword = 'AnypasswordIwant123'
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    //отправляем к телеграм === только для демонстрации
    const foundStudent = await UserModel.findById(id, (err, user) => {
        return user
    })
    sendTelegramMessage(`Admin changed ${foundStudent.name} to TeamLead
        His new account is email: ${foundStudent.email}
                           password: ${newpassword} `)

    

    await UserModel.findOneAndUpdate({_id:id}, 
        {isStudent: false, isTeamLead: true, password: hashedPassword}, 
        {new: true }, 
        function(err, doc) {

        if(err) {
            res.status(400).send(err)
        }
        res.redirect('/student/'+id)
    });
    console.log(id+'in makeTeamLead solution')
    
})

router.get('/makeStudentAgain/:id', async(req, res) => {
    let id = req.params.id

    //отправляем к телеграм === только для демонстрации
    const foundStudent = await UserModel.findById(id, (err, user) => {
        return user
    })
    sendTelegramMessage(`Admin changed ${foundStudent.name} to Student Again
        His email stays same: ${foundStudent.email}
        Now he can't access teamlead section ;)`)

    

    await UserModel.findOneAndUpdate({_id:id}, 
        {isStudent: true, isTeamLead: false}, 
        {new: true }, 
        function(err, doc) {

        if(err) {
            res.status(400).send(err)
        }
        res.redirect('/student/'+id)
    });
    console.log(id+'in makeStudenAgain solution')
    
})

router.get('/kickFromNeobis/:email', async(req, res) => {
    let email = req.params.email

    await UserModel.deleteOne({email: email}, function(err) {
        if(err) {
            res.status(400).send(err)
        }
        res.redirect('/nodejs')
    });
})


module.exports = router