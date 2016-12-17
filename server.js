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
app.use(session({secret: 'CBCINC', saveUninitialized: false, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

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
var myConfig = require('./config.js');
var config = myConfig.config;
var routes = require('./public/routes');
app.use('/routes',routes);
var workers = require('./public/workers');
app.use('/workers',workers);
//require('./config').config;
sql.setDefaultConfig( config );

//ROUTES

app.get('/', function(req,res){
    res.redirect('/home');
});

app.get('displaygiven',function(req,res){
    res.render('/blank', {data: req.query.data, layout: 'internal'});
});

app.get('/orderForm', function(req,res){
    var custid;
    var sqlFile = './public/sql/getCust.sql';
    if(!req.user){
        res.redirect('/signin');
    }
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {username: req.user.user_name}
    }).then(function(result){
        custid = result[0].custid;



    var sqlFile = './public/sql/getInfo.sql';
    var customerid,customername,ordernumber,telfax,orderdate,shipto,shipdate,address1,confirmdate,address2,requiredtime,city,state,zip,ponum,sm,shipvia;
    var rating,truesqft,twovnvvald,plusonwidth,noshor,contfaux;
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {custid: custid}
    }).then(function (result) {
            customerid = result[0].debcode,
            customername=result[0].cmp_name,
            ordernumber='000000',
            telfax=result[0].cmp_tel +'/' + result[0].cmp_fax,
            orderdate= (new Date()).toLocaleDateString(),
            shipto=result[0].cmp_name,
            shipdate='',
            address1= result[0].cmp_fadd1,
            confirmdate='',
            address2=result[0].cmp_fadd2,
            requiredtime='',
            city=result[0].cmp_fcity,
            state=result[0].StateCode,
            zip=result[0].cmp_fpc,
            ponum='',
            sm='',
            shipvia='',
            truesqft=result[0].YesNofield1,
            rating = result[0].textfield1,
            plusonwidth=result[0].YesNofield2,
            noshor=result[0].textfield3,
            contfaux=result[0].numberfield1,
            twovnvvald=result[0].textfield4;

        res.render('OrderForm', {
            custid: customerid,
            custname: customername,
            ordnum: ordernumber,
            telfax: telfax,
            orddt: orderdate,
            shipto: shipto,
            shipdt: shipdate,
            add1: address1,
            confdt: confirmdate,
            add2: address2,
            reqtime: requiredtime,
            city: city,
            state: state,
            zip: zip,
            ponum: ponum,
            sm: sm,
            shipvia: shipvia,
            truesqft: truesqft,
            rating: rating,
            overide: "N",
            twovnvvald: twovnvvald,
            plusonwidth: plusonwidth,
            noshor: noshor,
            contfaux: contfaux,
            user: req.user
        });
    },function (err) {
        console.log(err);
    });



    },function (err) {
        console.log(err);
        res.redirect('/signin');
    });

});

app.post('/orderForm',function(req,res){
    //send order to database
/*    for(var key in req.body) {
        if(req.body.hasOwnProperty(key)){
            console.log(key + ": "+JSON.stringify(req.body[key],null,4));
        }
    }*/
    var custid= req.body['CUSTID'],custname= req.body['CUSTNAME'],sonum= req.body['ORDNUM'],
        ponum= req.body['PONUM'],sm=req.body['SM'];
    var date = req.body['date'];
    for(var i = 1; i < req.body['rowlength'];i++) {
        var product =req.body['inside' + i + 'at1'],
            profile = req.body['inside' + i + 'at2'],
            color = req.body['inside' + i + 'at3'],
            qty = req.body['inside' + i + 'at4'],
            width = req.body['inside' + i + 'at5'],
            height = req.body['inside' + i + 'at7'],
            mt = req.body['inside' + i + 'at8'],
            val = req.body['inside' + i + 'at9'],
            valadd = req.body['inside' + i + 'at10'],
            valrt = req.body['inside' + i + 'at11'],
            ct = req.body['inside' + i + 'at12'],
            tc = req.body['inside' + i + 'at13'],
            hd = req.body['inside' + i + 'at14'],
            description = req.body['inside' + i + 'at151'],
            comment = req.body['inside' + i + 'at152'],
            unit = req.body['inside' + i + 'at153'],
            sub = req.body['inside' + i + 'at154'];

        if(profile=='EMBOSS' && product=='2\" FAUXWOOD'){
            product = '2\" FAUXWOODEMBOSS';
            if(color==('WHITE'))
                color = 'E101-WHITE';
            else if(color==('SNOW'))
                color = 'E301-SNOW';
            else if(color==('PEARL'))
                color = 'E605-PEARL';
            else if(color==('OYSTER'))
                color = 'E610-OYSTER';
            else if(color==('OFF-WHITE'))
                color = 'E613-OFF-WHITE';
            else if(color==('BIRCH'))
                color = 'E615-BIRCH';
            else if(color==('NATURAL'))
                color = 'E620-NATURAL';
            else if(color==('RIGHT-WHITE'))
                color = 'E621-RIGHT-WHITE';
            else if(color==('ALABASTER'))
                color = 'E926-ALABASTER';
        }
        else if(profile==('SMOOTH') && product==('2.5\" FAUXWOOD')){
            profile = ('2.5\" FAUXWOODSMOOTH');
        }
        else if(profile==('SMOOTH') && product==('1\" ALUMINUM')){
            profile = ('1\" AULUMINUMSMOOTH');
        }

        var w = (parseFloat(width)*1000).toString();
        var h = (parseFloat(height)*1000).toString();
        while (w.length < 6) w = "0"+w;
        while(h.length<6) h = "0"+h;
        var itemnum = numbers.convert(product) + '-' + numbers.convert(profile) + '-'
            + (numbers.convert(color) == "string")? numbers.convert(color) : ('0'+numbers.convert(color))
            +'-'+ w +'-'+ h +'-'+ct;
        var serial = date+'S'+sonum+'P'+numbers.convert(product)+numbers.convert(profile)+'C'+numbers.convert(color)+'W'+w+'H'+h+ct+'001';

        var sqlFile = './public/insert.sql';
        sql.execute({
            query: sql.fromFile(sqlFile),
            params: {
                sm:sm,
                custid: custid,
                custname: custname,
                sonum: sonum,
                ponum: ponum,
                product: numbers.convert(product),
                profile: numbers.convert(profile),
                color: numbers.convert(color),
                qty: qty,
                width: width,
                height: height,
                mount: mt,
                val: val,
                val_add: valadd,
                val_ret: valrt,
                ct: ct,
                num: itemnum,
                proddesc: (product + ' ' + profile + ' ' + color),
                colordesc: color,
                serial:serial,
                lineno: i,
                whenAdded: (new Date()).toLocaleDateString()
            }
        }).then(function (result) {
                console.log("success")
            })
            .catch(function (err) {
                console.log("Error");
                console.log(err);
                req.session.error = 'Something went wrong';
                res.redirect('/orderForm');
            });
        console.log(sm+custid+custname+sonum+ponum+numbers.convert(product)+numbers.convert(profile)+numbers.convert(color)+qty+width+height
            +mt+val+valadd+valrt+ct+itemnum+(product + ' ' + profile + ' ' + color)+color+serial+i+(new Date()).toLocaleDateString());
    }
    req.session.success = 'Order was placed';
    res.redirect('/home');
});

app.get('/home', function(req, res){
    res.render('home', {user: req.user});
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
            console.log("FOUND USER");
            console.log(result);
            var hash = result[0].user_password;
            console.log(hash);
            console.log(bcrypt.compareSync(req.body.password, hash));
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

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
}
//PASSPORT
// Passport session setup.
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.user_name);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
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