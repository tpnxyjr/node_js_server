// include modules
var	express = require('express'),
    session = require('express-session'),
    https = require('https'),
    http = require('http'),
    bodyParser = require("body-parser"),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    fs = require('fs'),
    //formidable = require("formidable"),
    util = require('util'),
    sql = require("seriate"),
    when = require("when"),
    path = require('path'),
    exphbs = require('express-handlebars'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    bcrypt = require('bcryptjs');
global.jQuery = require('jquery');
var app = express();
// EXPRESS
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(passport.initialize());
app.use(passport.session());
var myConfig = require('./config.js');
var config = myConfig.config;
app.use(session({secret: myConfig.secret, saveUninitialized: false, resave: false}));
// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

var hbs = exphbs.create({
    defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var funct = require('./public/js/functions.js'); //funct file contains our helper functions for our Passport and database work
var numbers = require('./public/js/numbers.js');
var routes = require('./public/routes');
app.use('/routes',routes);
var workers = require('./public/workers');
app.use('/workers',workers);
var customers = require('./public/customers');
app.use('/customers', customers);
sql.setDefaultConfig( config );

//ROUTES

app.get('/', function(req,res){
    res.redirect('/customers/home');
});
app.get('/ticketList', function(req,res){
    res.redirect('/routes/ticketList');
});

app.get('displaygiven',function(req,res){
    res.render('/blank', {data: req.query.data, layout: 'internal'});
});

app.get('/orderForm', function(req,res){
    res.redirect('/customers/orderForm');
});

app.get('/home', function(req, res){
    //res.render('home', {user: req.user});
    res.redirect('/customers/home');
});
app.get('/signin', function(req, res){
    res.render('signin');
});
app.get('/changePassword', function(req, res){
    res.render('changepw', {user: req.user});
});
app.get('/forgot',function(req,res){
    res.render('/forgot', {user: req.user});
});
app.post('/forgot', function(req,res){
    res.render('signin');
});
app.post('/changePassword', function(req,res){
    sqlFile = './public/sql/login.sql';
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {username: req.body.username}
    }).then(function (result) {
        if(result[0]!= null) {
            //console.log("FOUND USER");
            //console.log(result);
            var hash = result[0].user_password;
            //console.log(hash);
            //console.log(bcrypt.compareSync(req.body.password, hash));
            if (bcrypt.compareSync(req.body.password, hash)) {
                var hash = bcrypt.hashSync(req.body.newpassword, 8);
                var sqlFile = './public/sql/changePassword';
                sql.execute({
                    query:sql.fromFile(sqlFile),
                    params: {username: req.body.username,
                        password: hash}
                }).then(function () {
                    console.log("PASSWORD CHANGED " + req.body.newpassword);
                },function (err) {
                    console.log("UPDATE FAIL:" + err.body);
                });
            } else {
                console.log("PASSWORDS NOT MATCH");
            }
        }
        else{
            console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
        }
    },function (err) {
    });
    res.render('changepw', {user: req.user});
});

app.post('/local-reg', function(req,res,next){
    if(req.body.referral == ""){
        req.session.error = "Invalid Referral Code";
        res.redirect('/signin');
    }
    else{
        var sqlFile = './public/sql/getInfo.sql';
        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {custid: req.body.referral}
        }).then(function(result){
            if(result[0].debcode != req.body.referral){
                req.session.error = "Invalid Referral Code";
                res.redirect('/signin');
            }
            else {
                passport.authenticate('local-signup', function (err, user, info) {
                    if (err) {
                        return next(err);
                    }
                    if (!user)return res.redirect('/signin');
                    else {
                        var sqlFile = './public/sql/addName.sql';
                        sql.execute({
                            query: sql.fromFile(sqlFile),
                            params: {custid: req.body.referral, username: req.body.username}
                        }).then(function (result) {

                        }, function (err) {
                            console.log(err);
                        });
                        return res.redirect('/home');
                    }
                })(req, res, next);
            }
        },function (err) {
            console.log(err);
        });
    }
});
app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/home',
        failureRedirect: '/signin'
    })
);
app.get('/logout', function(req, res){
    if(req.user) {
        var name = req.user.user_name;
        console.log("LOGGING OUT " + req.user.user_name);
    }
    req.logout();
    res.redirect('/signin');
    req.session.notice = "You have successfully been logged out " + name + "!";
});
app.get('/error', function(req, res){
    res.render('error', {user:req.user});
});
app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('error', { url: req.url, user:req.user });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
}
//PASSPORT
// Passport session setup.
passport.serializeUser(function(user, done) {
    //console.log("serializing " + user.user_name);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    //console.log("deserializing " + obj);
    done(null, obj);
});
// Use the LocalStrategy within Passport to login/”signin” users.
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.user_name);
                    req.session.success = 'You are successfully logged in ' + user.user_name + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localReg(username, password)
            .then(function (user) {
                if (user) {
                    console.log("REGISTERED: " + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));

passport.use('local-changepw', new LocalStrategy(
    {passReqToCallback : true},
    function(req, username, newpassword, done){
        funct.changePassword(username,newpassword)
            .then(function(user){
                if(user){
                    req.session.success = ('password changed');
                    done(null, user);
                }
                if(!user){
                    req.session.error = ('password change failed');
                    done(null,user);
                }
        })
            .fail(function (err){
                console.log(err.body);
            });
    }
));
// setup server
var port = process.env.PORT || 8080;
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
var server = http.createServer(app).listen(port);
var server1 = https.createServer(options, app).listen(port+1);
console.log('server listening on '+port);
sql.execute( {
    query: sql.fromFile('./public/sql/test.sql')
} ).then( function( results ) {
    console.log( "Database Connection Successful" );
}, function( err ) {
    console.log( "Database Connection Failed:", err );
    server.close();
    server1.close();
} );