const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

// passport config
require('./config/verify')(passport);

// DB config
const db = require('./config/dbconnect').MongoURI;


// Connect to Mongo
mongoose.connect(process.env.MONGODB_URL || db, {
     useNewUrlParser: true,
     useUnifiedTopology: true 
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Middleware EJs view
app.use(expressLayouts);
app.set('view engine', 'ejs');

//handling put and delet routes
app.use(methodOverride('_method'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use(express.static('public'));

//flash
app.use(require('connect-flash')());
app.use(session({
    secret: 'Free Stevy',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error_tries = req.flash('error_tries');
    res.locals.error = req.flash('error');
    next();
});

//importing routes
app.use('/', require('./routes/guiroutes'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));