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

workers.get('/processOrder', function(req,res){res.redirect('/processOrders');})
workers.get('/processOrders',function(req,res){
    sql.execute({query: sql.fromFile('./sql/getUnmigrated.sql')
    }).then(function(result){
        var list =  '';
        for(var i = 0; i < result.length; i++){
            list = list + '<tr><td>'+result[i].order_dt+'</td><td>'+result[i].custid+'</td><td>'+result[i].sonum+'</td><td>'+result[i].ponum+'</td><td>'+result[i].delivery+'</td><td>'+result[i].ideal+'</td><td>'+result[i].instructions+'</td></tr>';
        }
        res.render('ProcessOrder', {orderlist: list, layout: 'internal'});
    });
});
workers.post('/processOrders',function(req,res){
    var macolaNumber = ("        " + parseInt(req.body.MacNum)).slice(-8);
    var webNumber = parseInt(req.body.WebNum)+"";
    var message = "";
    var later = function(){
        //extra_6 oeordhdr to save webordnum

        sql.execute({
            query: sql.fromFile("./sql/migrateOrder.sql"),
            params: {macnum: macolaNumber, webnum: webNumber, discount: myConfig.web_discount, web_disc: myConfig.discount_switch}
        }).then(function (result) {
            switch (result[0].response) {
                case 0:
                    message = "This MACOLA order does not exist.";
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

            sql.execute({
                query: sql.fromFile('./sql/getUnmigrated.sql')
            }).then(function (result) {
                var list = '';
                for (var i = 0; i < result.length; i++) {
                    list = list + '<tr><td>' + result[i].order_dt + '</td><td>' + result[i].custid + '</td><td>' + result[i].sonum + '</td><td>' + result[i].ponum + '</td><td>' + result[i].delivery + '</td><td>' + result[i].ideal + '</td><td>' + result[i].instructions + '</td></tr>';
                }
                res.render('ProcessOrder', {message: message, orderlist: list, layout: 'internal'});
            });
        });

    };
    var first = function(callback) {
        sql.execute({
            query: sql.fromFile("./sql/checkUOM.sql"),
            params: {sonum: webNumber}
        }).then(function (result) {
            //recalculate price total
            var len = result.length;
            if(len == 0) callback();
            for (var i = 0; i < len; i++) {
                var count = 0;
                var custid = result[i].custid, itemno = result[i].itemno, qty = result[i].qty;

                sql.execute({
                    query: sql.fromFile("./sql/getItemPrice.sql"),
                    params: {itemno: itemno, qty: qty}
                }).then(function (result) {
                    var temp_no = result[0].itemno, temp_qty = result[0].qty;
                    if (result[0] != null && result[0].prod_cat != 'ZZZ') {
                        var baseprice = result[0].price;
                        var prodcat = result[0].prod_cat;
                        if (temp_qty < 0 || isNaN(temp_qty)) temp_qty = 0;
                        sql.execute({
                            query: sql.fromFile("./sql/Code68.sql"),
                            params: {itemno: temp_no, code: '6', cat: prodcat}
                        }).then(function (result) {
                            if (result[0] == null) {
                                sql.execute({
                                    query: sql.fromFile("./sql/Code68.sql"),
                                    params: {itemno: temp_no, code: '8', cat: prodcat}
                                }).then(function (result) {
                                    if (result[0] == null) {
                                        sql.execute({
                                            query: sql.fromFile("./sql/getCustomerCode.sql"),
                                            params: {name: custid}
                                        }).then(function (result) {

                                            var custcode = result[0].AccountTypeCode;
                                            sql.execute({
                                                query: sql.fromFile("./sql/getDiscount.sql"),
                                                params: {itemno: temp_no, custid: custid, custcode: custcode}
                                            }).then(function (result) {
                                                // code 1,2,3,4,5,7
                                                var price = 0;
                                                var discount = 0;
                                                if (result[0].minimum_qty_5 != 0 && temp_qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                                                else if (result[0].minimum_qty_4 != 0 && temp_qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                                                else if (result[0].minimum_qty_3 != 0 && temp_qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                                                else if (result[0].minimum_qty_2 != 0 && temp_qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                                                else if (temp_qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                                                if (result[0].cd_tp == 1) price = discount;
                                                else price = (baseprice * (100 - discount) * 0.01);
                                                sql.execute({
                                                    query: sql.fromFile("./sql/addToTotal.sql"),
                                                    params: {
                                                        unit_price: price.toFixed(6),
                                                        price: (price * temp_qty).toFixed(6),
                                                        sonum: webNumber,
                                                        itemno: temp_no,
                                                        qty: temp_qty
                                                    }
                                                });
                                                if(count === len-1) callback();
                                                else count++;
                                            });

                                        });
                                    }
                                    else {
                                        //code 8
                                        var price = 0;
                                        var discount = 0;
                                        if (result[0].minimum_qty_5 != 0 && temp_qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                                        else if (result[0].minimum_qty_4 != 0 && temp_qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                                        else if (result[0].minimum_qty_3 != 0 && temp_qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                                        else if (result[0].minimum_qty_2 != 0 && temp_qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                                        else if (temp_qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                                        price = baseprice * (100 - discount) * 0.01;
                                        sql.execute({
                                            query: sql.fromFile("./sql/addToTotal.sql"),
                                            params: {
                                                unit_price: price.toFixed(6),
                                                price: (price * temp_qty).toFixed(6),
                                                sonum: webNumber,
                                                itemno: temp_no
                                            }
                                        });
                                        if(count === len-1) callback();
                                        else count++;
                                    }
                                });
                            }
                            else {
                                //code 6
                                var price = 0;
                                var discount = 0;
                                if (result[0].minimum_qty_5 != 0 && temp_qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                                else if (result[0].minimum_qty_4 != 0 && temp_qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                                else if (result[0].minimum_qty_3 != 0 && temp_qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                                else if (result[0].minimum_qty_2 != 0 && temp_qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                                else if (temp_qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                                price = baseprice * (100 - discount) * 0.01;
                                sql.execute({
                                    query: sql.fromFile("./sql/addToTotal.sql"),
                                    params: {
                                        unit_price: price.toFixed(6),
                                        price: (price * temp_qty).toFixed(6),
                                        sonum: webNumber,
                                        itemno: temp_no
                                    }
                                });
                                if(count === len-1) callback();
                                else count++;
                            }
                        });
                    }

                });
            }
        });
    };
    first(later);

});

exports.workers = workers;
module.exports= workers;

