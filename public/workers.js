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
workers.use(function(req, res, next){
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

workers.get('/processOrders',function(req,res){
    sql.execute({query: sql.fromFile('./sql/getUnmigrated.sql')
    }).then(function(result){
        var list =  '';
        for(var i = 0; i < result.length; i++){
            list = list + '<tr><td>'+result[i].custid+'</td><td>'+result[i].sonum+'</td></tr>';
        }
        res.render('ProcessOrder', {orderlist: list, layout: 'internal'});
    });
    });
workers.post('/processOrder',function(req,res){
    var macolaNumber = ("        " + parseInt(req.body.MacNum)).slice(-8);
    var webNumber = parseInt(req.body.WebNum)+"";
    var message = "";
    sql.execute({
        query: sql.fromFile("./sql/checkUOM.sql"),
        params: {sonum: webNumber}
    }).then(function() {
        sql.execute({
            query: sql.fromFile("./sql/migrateOrder.sql"),
            params: {macnum: macolaNumber, webnum: webNumber}
        }).then(function (result) {
            switch (result[0].response) {
                case 0:
                    message = "This order does not exist.";
                    break;
                case 1:
                    message = "This order has already been migrated.";
                    break;
                case 2:
                    message = "Order was successfully migrated.";
                    break;
                case 3:
                    message = "Order CUSTOMER ID do not match.";
            }

            res.render('ProcessOrder', {message: message, layout: 'internal'});
        });
    });

});

exports.workers = workers;
module.exports= workers;

