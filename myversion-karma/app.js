const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
//passport and session and flash
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

//handlebars import
const exphbs = require('express-handlebars')
//routes import
const routes = require('./routes/router')
const users = require('./routes/users.js')
const api = require('./routes/api.js')
const student = require('./routes/student.js')
const admin = require('./routes/admin.js')
//.env
const dotenv = require('dotenv')
dotenv.config();

//extra
const MongoStore = require('connect-mongo')(session);
require('./config/passport.js')(passport)
require('./config/passportGoogle.js')(passport)

const PORT = process.env.PORT || 3000
const url = process.env.DB_CONNECT

//test db
const url_test = 'mongodb+srv://admin:asyl00000@cluster0-ple4h.mongodb.net/test?retryWrites=true&w=majority'

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

//engine
//NOTE: test it using ejs
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

//midllewares
app.use(express.json())
app.use(flash())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

//passport

//session
app.use(session({
    secret: 'something',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    cookie: {
        maxAge: 60*1000*30
    }
}))

app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use(function(req, res, next) {
    res.locals.userou = req.user || null;
    res.locals.messages = req.flash('info') || null;
    res.locals.message_err = req.flash('error') || null;
    res.locals.message_em_exists = req.flash('message_em_exists') || null;
    next();
})

app.use('/', routes);
app.use('/users', users)
app.use('/api', api)
app.use('/student', student)
app.use('/admin', admin)



async function start() {
    try {
        await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
}

start()