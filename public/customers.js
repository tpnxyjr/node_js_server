var express = require('express'),
    sql  = require("seriate"),
    path = require('path'),
    passport = require('passport'),
    bodyParser = require("body-parser");
var customers = express.Router();
var myConfig = require('../config.js');
var config = myConfig.config;
sql.setDefaultConfig( config );
customers.use(passport.initialize());
customers.use(passport.session({secret: myConfig.secret, saveUninitialized: false, resave: false}));
customers.use(express.static( 'public'));
customers.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    next();
});
customers.use(bodyParser.json());

customers.get('/home',function(req,res){
    var data="<thead><tr><th>Order Number</th><th>Order Date</th><th>Order Type</th><th>PO Number</th><th>Order Status</th></tr></thead></tbody>";
    if(req.user){
        sql.execute({
            query: sql.fromFile("./sql/getCustomerOrders.sql"),
            params: {cusno: req.user.custid}
        }).then(function(result){
            for(var i = 0; i < result.length; i++){
                data = data + "<tr><td>"+result[i].ord_no+"</td><td>"+result[i].ord_dt.toString().substring(0,16)+"</td><td>"+result[i].ord_type+"</td><td>"+result[i].oe_po_no+"</td><td>"+result[i].status+"</td><td><a href='/customers/ViewOrder?sonum="+result[i].ord_no+"'><input type='button' value='View'></a></td></tr>"
            }
            data = data + "</tbody>"
            res.render('customerhome',{user: req.user, data: data});
        });
    }
    else res.render('customerhome',{user: req.user, data: "You have no open orders"});
});
customers.get('/changePassword', function(req, res){
    res.render('changepw', {user: req.user});
});
customers.get('/RegularOrder',function(req,res){
   res.render('RegularOrder',{user: req.user})
});
customers.post('/RegularOrder',function(req,res){
    //submitOrder
    for(var i = 1; i < req.body['rowlength'];i++) {
        var itemno = "inside"+i+"at1";
        var qty = "inside"+i+"at2";
        sql.execute({
            query: sql.fromFile("./sql/saveRegularOrder.sql"),
            params:{itemno: req.body[itemno],
                    qty: req.body[qty],
                    custid: req.user.custid
            }
        }).then(function(){
            req.session.success = "Order was placed";
            res.redirect('/customers/shoppingCart');
        },function(error){
            console.log(error);
            req.session.error = "Order failed";
            res.redirect('/customers/shoppingCart');
        });
    }

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
            if(req.query.qty < 0 || isNaN(req.query.qty)) req.query.qty = 0;
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
                                    "baseprice" : baseprice*(100-discount)*0.01,
                                    "totalprice" : baseprice*(100-discount)*0.01*req.query.qty
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
                                "baseprice" : baseprice*(100-discount)*0.01,
                                "totalprice" : baseprice*(100-discount)*0.01*req.query.qty
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

//custom orders
customers.get('/orderForm', function(req,res){
    if(req.user == null) res.redirect('/signin');
    var custid = (req.user != null)? req.user.custid : 0;
    /*
     var sqlFile = './public/sql/getCust.sql';
     if(!req.user){
     res.redirect('/signin');
     }
     sql.execute({
     query: sql.fromFile(sqlFile),
     params: {username: req.user}
     }).then(function(result){
     custid = result[0].custid;
     */


    var sqlFile = './sql/getInfo.sql';
    var customerid,customername,ordernumber,telfax,orderdate,shipto,shipdate,address1,confirmdate,address2,requiredtime,city,state,zip,ponum,sm,shipvia;
    var rating,truesqft,twovnvvald,plusonwidth,noshor,contfaux;
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {custid: custid}
    }).then(function (result) {
        if(result[0] == null) res.redirect('/signin');
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

        res.render('CustomOrder', {
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
        res.redirect('/signin');
    });


    /*
     },function (err) {
     console.log(err);
     res.redirect('/signin');
     });
     */
});

customers.post('/orderForm',function(req,res){
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

        var sqlFile = './sql/insert.sql';
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
                res.redirect('/CustomOrder');
            });
        console.log(sm+custid+custname+sonum+ponum+numbers.convert(product)+numbers.convert(profile)+numbers.convert(color)+qty+width+height
            +mt+val+valadd+valrt+ct+itemnum+(product + ' ' + profile + ' ' + color)+color+serial+i+(new Date()).toLocaleDateString());
    }
    req.session.success = 'Order was placed';
    res.redirect('/home');
});

customers.get('/ViewOrder', function(req,res){
    var sonum = req.query.sonum;
    var data = '';
    sql.execute({
        query: sql.fromFile("./sql/getOrder.sql"),
        params: { sonum: sonum, custid: req.user.custid }
    }).then(function(result){
        if(result[0] == null) data = "An error occured when pulling up this order";
        else {


        }
        res.render('ViewOrder',{data: data});
    });

});

customers.get('/shoppingCart',function(req,res){
    var custid = (req.user != null)? req.user.custid : 'A';
    sql.execute({
        query: sql.fromFile("./sql/getShoppingCart.sql"),
        params: {custid: custid}
    }).then(function(result){
        var data = '';
        for(var i = 1; i < result.length+1; i++){
            data = data + "<tr><td>"+i+"</td><td><input type = 'text' id = 'item"+i+"' value='"+result[i-1].itemno+"' style='border:none' readonly></td><td>"+result[i-1].qty+"</td><td><input type='button' value = 'Remove' onclick='remove("+i+");'></td></tr>";
        }
        res.render('PrintableOrder',{user:req.user, data:data});
    });
});
customers.post('/removeFromCart',function(req,res){
    var itemno = req.body.itemno;
    sql.execute({
        query: sql.fromFile('./sql/removeOrder.sql'),
        params: {custid: req.user.custid, itemno: itemno}
    });
    res.json({success : "Updated Successfully", status : 200});
});
exports.customers = customers;
module.exports= customers;