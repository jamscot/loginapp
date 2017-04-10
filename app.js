var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
// telling system we want a folder called views to handle our views
app.set('views', path.join(__dirname, 'views'));
// setting app.enginne to handlebars and telling it the default layout file is layout.handlebars
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
// then set app engine to handlebars
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder .... set public folder, public folder is where stylsheets, images, jquery..stuff thats publically accessible
app.use(express.static(path.join(__dirname, 'public')));


// Express Session, middleware setup for expresee session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());



//Express validator.......from github page, http://github.com/ctavan/express-validator
// The error formateer option can be used to specify a function that can be used to format the objects that populate the error array
// that is returned in req.validationErrors(). it should return an object that has param, msg and value keys defined.
//

app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// connect Flash
app.use(flash());

// Global Variables
//use res.locals to define a global variable
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', routes);
app.use('/users', users);

// Set port and start server

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});


