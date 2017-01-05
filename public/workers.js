var express = require('express'),
    sql  = require("seriate"),
    path = require('path'),
    passport = require('passport');
var workers = express.Router();
var myConfig = require('../config.js');
var config = myConfig.config;
sql.setDefaultConfig( config );
workers.use(passport.initialize());
workers.use(passport.session());
workers.use(express.static(path.join(__dirname, 'public')));

workers.get('/login', function(req,res){
   res.render('workerlogin', {date:(new Date()).toLocaleDateString(),layout:'date'});
});

workers.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/workers/home',
        failureRedirect: '/workers/login'
})
);

workers.get('/home', function(req,res){
    res.render('workerhome', {user: req.user, date:(new Date()).toLocaleDateString(),layout:'date'});
});


exports.workers = workers;
module.exports= workers;

