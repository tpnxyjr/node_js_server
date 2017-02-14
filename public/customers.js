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
customers.use(express.static(path.join(__dirname, 'public')));



exports.customers = customers;
module.exports= customers;