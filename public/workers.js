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

workers.get('/viewcomments', function(req,res){
    var sonum = req.query.sonum;
    var lineno = req.query.lineno;
    var prerender = "<table><tr><th>ln</th><th>comment</th></tr>";
    sql.execute({
        query: sql.fromFile("./sql/getComments.sql"),
        params: {sonum: sonum, lineno: lineno}
    }).then(function (result) {

        for(var i = 0; i < result.length; i++) {
            prerender = prerender + "<tr><td>"+result[i].comment_num + "</td><td> "+ result[i].comment +"</td></tr>";
        }
        prerender = prerender + "</table>";
        res.render('blank',{data: prerender});
    },function (err) {
        console.log(err);
    });
});





exports.workers = workers;
module.exports= workers;

