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
    var data="<thead><tr><th>Order Number</th><th>Order Date</th><th>Order Type</th><th>PO Number</th><th>Order Status</th></tr></thead></tbody>";
    if(req.user){
        sql.execute({
            query: sql.fromFile("./sql/getCustomerOrders.sql"),
            params: {cusno: req.user.custid}
        }).then(function(result){
            for(var i = 0; i < result.length; i++){
                data = data + "<tr><td>"+result[i].ord_no+"</td><td>"+result[i].ord_dt.toString().substring(0,16)+"</td><td>"+result[i].ord_type+"</td><td>"+result[i].oe_po_no+"</td><td>"+result[i].status+"</td></tr>"
            }
            data = data + "</tbody>"
            res.render('customerhome',{user: req.user, data: data});
        });
    }
    else res.render('customerhome',{user: req.user, data: "You have no open orders"});
});
customers.get('/RegularOrder',function(req,res){
   res.render('RegularOrder',{user: req.user})
});
customers.post('/RegularOrder',function(req,res){
    //submitOrder
});
customers.get('/getItem',function(req,res){
    var itemno = req.query.itemno;

    sql.execute({
        query: sql.fromFile("./sql/getItemInfo.sql"),
        params:{itemno: itemno}
    }).then(function (result){
        if(result[0] == null){
            var data = [];
            data.push({
                "item_desc": "Not A Valid Item",
                "uom": ""
            });
            res.end(JSON.stringify(data));
        }
        else {
            var data = [];
            data.push({
                "item_desc": result[0].item_desc_1,
                "uom": result[0].uom
            });
            res.end(JSON.stringify(data));
        }
    },function (err) {
        console.log(err);
    });
});
customers.get('/getPrice',function(req,res){
    var data = [];
    sql.execute({
        query: sql.fromFile("./sql/getItemPrice.sql"),
        params:{ itemno : req.query.itemno}
    }).then(function (result){
        if(result == null){
            data.push({
                "baseprice" : "Price Not Found",
                "totalprice" : 0
            });
            res.end(JSON.stringify(data));
        }
        else{
            var baseprice = result[0].price;
            var prodcat = result[0].prod_cat;

            sql.execute({
                query: sql.fromFile("./sql/Code68.sql"),
                params:{ itemno : req.query.itemno, code : '6', cat : prodcat}
            }).then(function(result){
               if(result[0] == null){
                   sql.execute({
                       query: sql.fromFile("./sql/Code68.sql"),
                       params:{ itemno : req.query.itemno, code: '8', cat : prodcat}
                   }).then(function(result) {
                        if(result[0] == null){
                            sql.execute({
                                query: sql.fromFile("./sql/getCustomerCode.sql"),
                                params:{ name : req.user.custid}
                            }).then(function(result) {

                            var custcode = result[0].AccountTypeCode;
                            sql.execute({
                                query: sql.fromFile("./sql/getDiscount.sql"),
                                params:{ itemno : req.query.itemno, custid: req.user.custid, custcode: custcode}
                            }).then(function(result) {
                                // code 1,2,3,4,5,7

                                var discount = 0;
                                if(result[0].minimum_qty_5 != 0 && req.query.qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                                else if(result[0].minimum_qty_4 != 0 && req.query.qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                                else if(result[0].minimum_qty_3 != 0 && req.query.qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                                else if(result[0].minimum_qty_2 != 0 && req.query.qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                                else if(req.query.qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                                data.push({
                                    "baseprice" : baseprice*discount*0.01,
                                    "totalprice" : baseprice*discount*0.01*req.query.qty
                                });
                                res.end(JSON.stringify(data));
                            });

                            });
                        }
                       else{
                            //code 8
                            var discount = 0;
                            if(result[0].minimum_qty_5 != 0 && req.query.qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                            else if(result[0].minimum_qty_4 != 0 && req.query.qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                            else if(result[0].minimum_qty_3 != 0 && req.query.qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                            else if(result[0].minimum_qty_2 != 0 && req.query.qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                            else if(req.query.qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                            data.push({
                                "baseprice" : baseprice*discount*0.01,
                                "totalprice" : baseprice*discount*0.01*req.query.qty
                            });
                            res.end(JSON.stringify(data));
                        }
                   });
               }
                else{
                   //code 6
                   var discount = 0;
                   if(result[0].minimum_qty_5 != 0 && req.query.qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                   else if(result[0].minimum_qty_4 != 0 && req.query.qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                   else if(result[0].minimum_qty_3 != 0 && req.query.qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                   else if(result[0].minimum_qty_2 != 0 && req.query.qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                   else if(req.query.qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                   data.push({
                       "baseprice" : baseprice*(100-discount)*0.01,
                       "totalprice" : baseprice*(100-discount)*0.01*req.query.qty
                   });
                   res.end(JSON.stringify(data));
               }
            });
        }

    });
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
customers.get('/iteminfo',function(req,res){

});
exports.customers = customers;
module.exports= customers;