var express = require('express'),
    sql  = require("seriate"),
    path = require('path'),
    passport = require('passport');
var customers = express.Router();
var myConfig = require('../config.js');
var config = myConfig.config;
sql.setDefaultConfig( config );
customers.use(passport.initialize());
customers.use(passport.session());
customers.use(express.static( 'public'));

customers.get('/home',function(req,res){
    res.render('customerhome',{user: req.user});
});
customers.get('/RegularOrder',function(req,res){
   res.render('RegularOrder',{user: req.user})
});
customers.get('/search',function(req,res){
    sql.execute({
        query: sql.fromFile("./sql/search.sql"),
        params: {key:req.query.key+'%'}
    }).then(function (result) {
        var data=[];
        for(var i = 0; i < result.length; i++){
            data.push(result[i].item_no);
        }
        res.end(JSON.stringify(data));
    },function (err) {
        console.log(err);
    });
});
exports.customers = customers;
module.exports= customers;