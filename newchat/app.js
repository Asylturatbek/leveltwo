const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

var MongoDBStore = require('connect-mongodb-session')(session);

const atlasmongouri = 'mongodb+srv://asyl:asyl00000@cluster0-ple4h.mongodb.net/test?retryWrites=true&w=majority'


var store = new MongoDBStore(
  {
    uri: atlasmongouri,
    databaseName: 'connect_mongodb_session_test',
    collection: 'mySessions'
  },
  function(error) {
    // Should have gotten an error
});

store.on('error', function(error) {
  // Also get an error here
});

const mongoose = require('mongoose')
mongoose.connect(atlasmongouri, {
	useNewUrlParser: true,
	useUnifiedTopology: true 
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to db')
});

var Schema = mongoose.Schema;

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

var userSchema = new Schema({
  name:  String, // String is shorthand for {type: String}
  email: String,
  password:   String,
});

var Users = mongoose.model('Users', userSchema);

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
	store: store,
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
	console.log(req.session.userId)
	Users.findOne({_id: req.session.userId}).then(user => {
		console.log(user)
		return res.render('index', {userId, user})
	})
})

app.get('/chat', redirectLogin, (req, res) => {
	console.log(req.session.userId)
	Users.findOne({_id: req.session.userId}).then(user => {
		console.log(user)
		return res.render('chat', {user})
	})
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
		Users.findOne({email, password}).then(user => {
			console.log(user == null)
			if(user !== null) { 
				req.session.userId = user.id
				return res.redirect('/chat')
			} else {
				req.flash('loginerror', 'Password or email is incorrect')
				console.log('Something wrong. Did not find that user')
				res.redirect('/login')
			}
		})
	}
})

app.post('/register', redirectHome, (req, res) => {
	const { name, email, password } = req.body
	if (name && email && password) {  //TODO: validation
		Users.findOne({email}).then(user => {
			console.log(user)
			if (!user == null){
				req.flash('registererror', 'This user already exists')
				res.redirect('/register')
			} else {
				const user = {
					name,
					email,
					password // TODO: hash
				}

				var newuser = new Users(user);
				newuser.save(function (err, data) {
			    	if (err) return console.error(err);
			 	});
				req.session.userId = newuser.id
				console.log('the session user id in post register:  '+req.session.userId)
				return res.redirect('/chat')
			}
		})
	} else {
		req.flash('registererror', 'Fill in all the fields')
		res.redirect('/register') //TODO: qs /register?error=error.auth.userExists
	}
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