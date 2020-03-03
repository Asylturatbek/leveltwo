const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

const TWO_HOURS = 100 * 60 * 60 *2
console.log(TWO_HOURS)
const {
	PORT = 3000,
	NODE_ENV = 'development',

	SESS_SECRET = 'ssh!quiet,it\'asecret!',
	SESS_NAME = 'sid',
	SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

// TODO: wire it up to database
const users = [
	{ id: 1, name: 'Alex', email: 'alex@gmail.com', password: 'secret' },
	{ id: 2, name: 'Zenniem', email: 'zen@gmail.com', password: 'secret' },
	{ id: 3, name: 'Menniem', email: 'men@gmail.com', password: 'secret' }
]

app.use(bodyParser.urlencoded({
	extended: true
}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.use(session({
	name: SESS_NAME,
	resave: false,
	saveUninitialized: false,
	secret: SESS_SECRET,
	cookie: {
		maxAge: SESS_LIFETIME,
		sameSite: true,
		secure: IN_PROD
	}
}))

//flash middleware
app.use(flash())

// middleware function which gives access to authorized users to certain pages
const redirectLogin = (req, res, next) => {
	if (!req.session.userId) {
		res.redirect('/login')
	} else {
		next()
	}
}

const redirectHome = (req, res, next) => {
	if(req.session.userId){
		res.redirect('/chat')
	} else {
		next()
	}
}

app.get('/', (req, res) => {
	const { userId } = req.session
	const user = users.find(user => user.id === req.session.userId)	

	res.render('index', {userId, user})
})

app.get('/chat', redirectLogin, (req, res) => {
	const user = users.find(user => user.id === req.session.userId)
	res.render('chat', {user})
})

app.get('/login', redirectHome, (req, res) => {
	res.render('login', {errorinfo: req.flash('loginerror')}) 
})

app.get('/register', redirectHome, (req, res) => {
	res.render('register', {errorinfo: req.flash('registererror')})
})

app.post('/login', redirectHome, (req, res) => {
	const { email, password } = req.body

	if(email && password) {
		const user = users.find( // TODO: hash the password
			user => user.email === email && user.password === password
		)
		if(user) {
			req.session.userId = user.id
			return res.redirect('/chat')
		}
	}
	req.flash('loginerror', 'Password or email is incorrect')
	console.log('Something wrong. Did not find that user')
	res.redirect('/login')
})

app.post('/register', redirectHome, (req, res) => {
	const { name, email, password } = req.body
	if (name && email && password) {  //TODO: validation
		const exists = users.some(
			user => user.email === email
		)
		if (!exists) {
			const user = {
				id: users.length+1,
				name,
				email,
				password // TODO: hash
			}
			users.push(user)
			req.session.userId = user.id
			return res.redirect('/chat')
		}
	}
	req.flash('registererror', 'Fill in all the fields')
	res.redirect('/register') //TODO: qs /register?error=error.auth.userExists
})

app.post('/logout', redirectLogin, (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return res.redirect('/chat')
		}
		res.clearCookie(SESS_NAME)
		res.redirect('/')
	})
})

io.on('connection', socket => {
	console.log('a user connected')

	socket.on('disconnect', ()=> {
		console.log('a user disconnected')
	})

	socket.on('message', (message) => {
		//broadcast to everyone
		io.emit('message', message);
	})
})

http.listen(PORT, () => console.log(
	`http://localhost:${PORT}`
	))


			// FIXME: fix me linting
			// NOTE :some other note
			// @todo: to do @
			// XXX: I dont't know this
			// README: readme message
			// 