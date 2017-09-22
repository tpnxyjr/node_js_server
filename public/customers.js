var express = require('express'),
    sql  = require("seriate"),
    path = require('path'),
    passport = require('passport'),
    bodyParser = require("body-parser"),
    mailer = require('./mailer'),
    pdfmaker = require('./pdfmaker');
var numbers = require('../public/js/numbers.js');
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

    next();
});
customers.use(bodyParser.json());
customers.get('/logout', function(req, res){
    if(req.user) {
        var name = req.user.user_name;
        console.log("LOGGING OUT " + req.user.user_name);
    }
    req.logout();
    res.redirect('/signin');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

customers.get('/home', loggedIn, function(req,res){
    var data="";
        sql.execute({
            query: sql.fromFile("./sql/getCustomerOrders.sql"),
            params: {cusno: req.user.custid}
        }).then(function(result){
            if(result.length == 0) res.render('customerhome',{user: req.user, data: "You have no open orders"});
            else {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == '6') result[i].status = '7';

                    data = data + "<tr";
                    if (result[i].older == 1) data = data + " class='older' style='display:none;'";
                    if(result[i].webnum == null) result[i].webnum = 'xxxxxx';
                    data = data + "><td>"+result[i].webnum+"</td><td>" + result[i].ord_no + "</td><td>" + result[i].ord_dt + "</td><td>" + result[i].ord_type + "</td><td>" + result[i].oe_po_no + "</td><td>" + result[i].status + "</td><td><a href='/customers/ViewOrder?sonum=" + result[i].ord_no + "'><input type='button' value='View'></a></td></tr>"

                }
                sql.execute({
                    query: sql.fromFile("./sql/getCustomerWebOrders.sql"),
                    params: {custid: req.user.custid}
                }).then(function (result2) {
                    for (var j = 0; j < result2.length; j++) {
                        if(result2[j].ord_type == null)result2[j].ord_type = '';
                        if(result2[j].macnum == null) {
                            result2[j].macnum = 'xxxxxx';
                            data = data + "<tr><td>" + result2[j].ord_id + result2[j].ord_type + "</td><td>" + result2[j].macnum + "</td><td>" + result2[j].ord_dt + "</td><td>Web</td><td></td><td>W</td><td><a href='/customers/ViewOrder?webnum=" + result2[j].ord_id + "'><input type='button' value='View'></a></td></tr>";
                        }
                    }
                    data = data + "</tbody>"
                    res.render('customerhome', {user: req.user, data: data, Date: new Date().toLocaleString()});
                });
            }
        });

});
customers.get('/changePassword', loggedIn, function(req, res){
    res.render('changepw', {user: req.user});
});
customers.get('/RegularOrder', loggedIn, function(req,res){
   res.render('RegularOrder',{user: req.user, Date: new Date().toLocaleString()})
});
customers.post('/RegularOrder',loggedIn, function(req,res){
    if(req.body['rowlength'] <= 1){
        req.session.error = "Empty Order";
        res.redirect('/customers/RegularOrder');
    }
    else {
        var ponum = req.body.PONUM.length > 50? req.body.PONUM.substring(0,50): req.body.PONUM.replace(/\s+$/, '');
        var smnum = req.body.SMNUM.length > 50? req.body.SMNUM.substring(0,50): req.body.SMNUM.replace(/\s+$/, '');
        var instructions = req.body.instructions.replace(/\s+$/, '');
        var delivery = req.body.delivery.length > 50? req.body.delivery.substring(0,50): req.body.delivery.replace(/\s+$/, '');
        var ideal = req.body.IDEAL;

        sql.execute({
            query: sql.fromFile("./sql/saveRegularOrderHeader.sql"),
            params:{
                custid: req.user.custid,
                ponum: ponum,
                smnum: smnum,
                instructions: instructions,
                delivery: delivery,
                ideal: ideal
            }
        });
        try {
            for (var i = 1; i < req.body['rowlength']; i++) {
                var itemno = "inside" + i + "at1";
                var uom = "uom"+i;
                var qty = "inside" + i + "at3";
                /*
                sql.execute({
                    query: sql.fromFile("./sql/getUom.sql"),
                    params: {
                        itemno: itemno
                    }
                }).then(function(result) {
                    if (uom == result[0].uom_1){
                        qty = qty * result[0].qty_1;
                        uom = result[0].uom_2;
                    }
                    */
                if(req.body[itemno] == "")continue;
                    sql.execute({
                        query: sql.fromFile("./sql/saveRegularOrder.sql"),
                        params: {
                            itemno: req.body[itemno],
                            uom: req.body[uom],
                            qty: req.body[qty],
                            custid: req.user.custid
                        }
                    }).then(function () {
                    }, function (error) {
                        console.log(error);
                        req.session.error = "Order failed";
                        res.redirect('/customers/shoppingCart');
                    });
                //});
            }
        }
        catch(err){
            req.session.error = "Invalid page modification";
            res.redirect('/customers/RegularOrder');
        }
        req.session.success = "Order submitted, please confirm and send using the button below. Refresh page if cart is not updated.";
        res.redirect('/customers/shoppingCart');
    }
});
customers.get('/getItem',function(req,res){
    var itemno = req.query.itemno.trim();

    sql.execute({
        query: sql.fromFile("./sql/getItemInfo.sql"),
        params:{itemno: itemno}
    }).then(function (result){
        if(itemno.trim().match(/^\d{3}-\d{3}-\d{3}$/)){
            var data = [];
            data.push({
                "item_desc": "Custom",
                "item_desc_2": '',
                "uom": "EA",
                "current_cell" : req.query.current_cell
            });
            res.end(JSON.stringify(data));
    }
        else if(result[0] == null){
            var data = [];
            data.push({
                "item_desc": "Not A Valid Item",
                "item_desc_2": '',
                "uom": "",
                "current_cell" : req.query.current_cell
            });
            res.end(JSON.stringify(data));
        }
        else {
            var data = [];
            data.push({
                "item_desc": result[0].item_desc_1,
                "item_desc_2": result[0].item_desc_2,
                "uom": result[0].uom,
                "current_cell" : req.query.current_cell
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
        if(result[0] == null){
            data.push({
                "baseprice" : "Price Not Found",
                "totalprice" : 0,
                "current_cell" : req.query.current_cell
            });
            res.end(JSON.stringify(data));
        }
        else{
            var baseprice = result[0].price;
            var prodcat = result[0].prod_cat;
            if(prodcat == 'ZZZ'){
                data.push({
                    "baseprice" : 'Special',
                    "totalprice" : 'Special',
                    "current_cell" : req.query.current_cell
                });
                res.end(JSON.stringify(data));
            }
            else if(req.query.qty < 0 || isNaN(req.query.qty)) req.query.qty = 0;
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
                                var price = 0;
                                var discount = 0;
                                if(result[0].minimum_qty_5 != 0 && req.query.qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                                else if(result[0].minimum_qty_4 != 0 && req.query.qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                                else if(result[0].minimum_qty_3 != 0 && req.query.qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                                else if(result[0].minimum_qty_2 != 0 && req.query.qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                                else if(req.query.qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                                if(result[0].cd_tp == 1) price = discount;
                                else price = baseprice*(100-discount)*0.01;
                                data.push({
                                    "baseprice" : price,
                                    "totalprice" : price * req.query.qty,
                                    "current_cell" : req.query.current_cell
                                });
                                res.end(JSON.stringify(data));
                            });

                            });
                        }
                       else{
                            //code 8
                            var price = 0;
                            var discount = 0;
                            if(result[0].minimum_qty_5 != 0 && req.query.qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                            else if(result[0].minimum_qty_4 != 0 && req.query.qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                            else if(result[0].minimum_qty_3 != 0 && req.query.qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                            else if(result[0].minimum_qty_2 != 0 && req.query.qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                            else if(req.query.qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                            price = baseprice*(100-discount)*0.01;
                            data.push({
                                "baseprice" : price,
                                "totalprice" : price*req.query.qty,
                                "current_cell" : req.query.current_cell
                            });
                            res.end(JSON.stringify(data));
                        }
                   });
               }
                else{
                   //code 6
                   var price = 0;
                   var discount = 0;
                   if(result[0].minimum_qty_5 != 0 && req.query.qty > result[0].minimum_qty_5) discount = result[0].prc_or_disc_5;
                   else if(result[0].minimum_qty_4 != 0 && req.query.qty > result[0].minimum_qty_4) discount = result[0].prc_or_disc_4;
                   else if(result[0].minimum_qty_3 != 0 && req.query.qty > result[0].minimum_qty_3) discount = result[0].prc_or_disc_3;
                   else if(result[0].minimum_qty_2 != 0 && req.query.qty > result[0].minimum_qty_2) discount = result[0].prc_or_disc_2;
                   else if(req.query.qty > result[0].minimum_qty_1) discount = result[0].prc_or_disc_1;
                   price = baseprice*(100-discount)*0.01;
                   data.push({
                       "baseprice" : price,
                       "totalprice" : price*req.query.qty,
                       "current_cell" : req.query.current_cell
                   });
                   res.end(JSON.stringify(data));
               }
            });
        }

    });
});
customers.get('/getUOM', function(req,res){
    sql.execute({
        query: sql.fromFile("./sql/getUom.sql"),
        params: { itemno: req.query.itemno }
    }).then(function(result) {
        if(result[0] !== null && result[0] !== undefined) {
            var data = [];
            data.push({
                "uom_1" : result[0].uom_1,
                "qty_1" : result[0].qty_1,
                "uom_2" : result[0].uom_2,
                "qty_2" : result[0].qty_2
            });
            res.end(JSON.stringify(data));
        }
        else
            res.end();
    });
});
customers.get('/getConversion', function(req,res){
    var itemno = req.query.itemno;
    var uom = req.query.uom;
    var current_cell = req.query.current_cell;
    sql.execute({
        query: sql.fromFile("./sql/getUom.sql"),
        params: { itemno: itemno }
    }).then(function(result) {
        if(result[0] !== null && result[0] !== undefined) {
            var data = [];
            if (uom.trim() == result[0].uom_1.trim()) {
                if(result[0].qty_1 == null) result[0].qty_1 = 1;
                data.push({"convert": result[0].qty_1, "current_cell" : current_cell});
                res.end(JSON.stringify(data));
            }
            else if(uom.trim() == result[0].uom_2.trim()){
                if(result[0].qty_2 == null) result[0].qty_2 = 1;
                data.push({"convert": result[0].qty_2, "current_cell" : current_cell});
                res.end(JSON.stringify(data));
            }
        }
        else res.end();
    });
});
function roundToTwo(num) {
    return (+(Math.round(num + "e+2")  + "e-2")).toFixed(2);
}
function roundToFour(num) {
    return +(Math.round(num + "e+4")  + "e-4");
}
customers.get('/search',function(req,res){
    sql.execute({
        query: sql.fromFile("./sql/search.sql"),
        params: {key:req.query.key.trim()+'%'}
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

//orderform = contract orders
customers.get('/orderForm', loggedIn, function(req,res){

    var custid = req.user.custid;

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
            user: req.user,
            Date: new Date().toLocaleString()
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

customers.post('/orderForm', loggedIn, function(req,res) {
    var custid = req.body['CUSTID'], custname = req.body['CUSTNAME'],
        ponum = req.body['PONUM'], sm = req.body['SM'], delivery = req.body['delivery'], sonum = ' xxxxxx';
    var date = req.body['date'];
    var pdfdata = 'CUSTOM ORDER FROM ' + req.user.custid
                    + '\n' + "sm: " + sm + '\n' + "cust id: " + custid + '\n' + "cust name: " + custname + '\n' + "po num: " + ponum + '\n' + "ship via: " + delivery + '\n'+
                    '______________________________________________________________________________________________________________________________\n \n';
    sql.execute({
        query: sql.fromFile("./sql/createNewOrderId.sql")
    }).then(function(result){
        var sonum = result[0].newnum;

        for (var i = 1; i < req.body['rowlength']; i++) {
        var product = isNumeric(req.body['inside' + i + 'at1'].substring(0,4))?req.body['inside' + i + 'at1'].substring(6):req.body['inside' + i + 'at1'],
            profile = isNumeric(req.body['inside' + i + 'at2'].substring(0,4))?req.body['inside' + i + 'at2'].substring(6):req.body['inside' + i + 'at2'],
            color = isNumeric(req.body['inside' + i + 'at3'].substring(0,4))?req.body['inside' + i + 'at3'].substring(6):req.body['inside' + i + 'at3'],
            qty = req.body['inside' + i + 'at4'],
            width = req.body['inside' + i + 'at5'],
            height = req.body['inside' + i + 'at7'],
            mt = (req.body['inside' + i + 'at8'] == null) ? '' : req.body['inside' + i + 'at8'],
            val = (req.body['inside' + i + 'at9'] == null) ? '' : req.body['inside' + i + 'at9'],
            valadd = (req.body['inside' + i + 'at10'] == null) ? '' : req.body['inside' + i + 'at10'],
            valrt = (req.body['inside' + i + 'at11'] == null) ? '' : req.body['inside' + i + 'at11'],
            ct = (req.body['inside' + i + 'at12'] == null) ? '' : req.body['inside' + i + 'at12'],
            tc = (req.body['inside' + i + 'at13'] == null) ? '' : req.body['inside' + i + 'at13'],
            hd = (req.body['inside' + i + 'at14'] == null) ? '' : req.body['inside' + i + 'at14'],
            description = req.body['inside' + i + 'at151'],
            comment = (req.body['inside' + i + 'at152'] == null) ? '' : req.body['inside' + i + 'at152'],
            unit = req.body['inside' + i + 'at153'],
            sub = (req.body['inside' + i + 'at154'] == null)? 0 : req.body['inside' + i + 'at154'];
        if (parseFloat(width) < 10) continue;


        if (profile == 'EMBOSS' && product == '2\" FAUXWOOD EMBOSS') {
            //product = '2\" FAUXWOODEMBOSS';
            if (color == ('WHITE'))
                color = 'E101-WHITE';
            else if (color == ('SNOW'))
                color = 'E301-SNOW';
            else if (color == ('PEARL'))
                color = 'E605-PEARL';
            else if (color == ('OYSTER'))
                color = 'E610-OYSTER';
            else if (color == ('OFF-WHITE'))
                color = 'E613-OFF-WHITE';
            else if (color == ('BIRCH'))
                color = 'E615-BIRCH';
            else if (color == ('NATURAL'))
                color = 'E620-NATURAL';
            else if (color == ('RIGHT-WHITE'))
                color = 'E621-RIGHT-WHITE';
            else if (color == ('ALABASTER'))
                color = 'E926-ALABASTER';
        }
        else if (profile == ('SMOOTH') && product == ('2\" FAUXWOOD SMOOTH')) {
            if (color == ('WHITE'))
                color = 'HWHITE';
            else if (color == ('OFF-WHITE'))
                color = 'HOFF-WHITE';
        }
        else if (product.indexOf('VERTICAL') != -1) {
            if (color == ('WHITE'))
                color = 'VWHITE';
            else if (color == ('OFF-WHITE'))
                color = 'VOFF-WHITE';
        }

        var w = (parseFloat(width) * 1000).toString();
        var h = (parseFloat(height) * 1000).toString();
        while (w.length < 6) w = "0" + w;
        while (h.length < 6) h = "0" + h;

            /*sql.execute({
                query: sql.fromFile("./sql/saveCustomOrder.sql"),
                params: {
                    sonum: sonum,
                    itemno: numbers.convert(product).toString() + '-' + numbers.convert(profile).toString() + '-' + numbers.convert(color).toString(),
                    line: i,
                    qty: qty,
                    custid: custid,
                    sub: sub
                }
            }).then(function(result)
            {*/
                var itemnum = numbers.convert(product).toString() + '-' + numbers.convert(profile).toString() + '-' + numbers.convert(color).toString();
                 //+ '-' + w + '-' + h + '-' + ct;
                 var serial = date + 'S' + sonum + 'P' + numbers.convert(product) + numbers.convert(profile) + 'C' + numbers.convert(color) + 'W' + w + 'H' + h + ct + '001';

                 sql.execute({
                 query: sql.fromFile('./sql/insert.sql'),
                 params: {
                 sm: sm,
                 custid: custid,
                 custname: custname,
                 sonum: sonum, //doesn't exist
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
                 tc: tc,
                 hd: hd,
                 num: itemnum,
                 proddesc: (product + ' ' + profile + ' ' + color),
                 colordesc: color,
                 serial: serial,
                 lineno: i,
                 whenAdded: (new Date()).toLocaleDateString(),
                     subtotal: sub,
                     delivery: delivery,
                     comment: comment
                 }
                 }).then(function (result) {
                 //console.log("success");
                 },function (err) {
                 console.log("Error");
                 console.log(err);
                 req.session.error = 'Something went wrong';
                 res.redirect('/CustomOrder');
                 });
           // });





        }
    });
    req.session.success = "Order submitted, please confirm and send using the button below";
    res.redirect('/customers/customCart');

});
function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}
customers.get('/ViewOrder', loggedIn, function(req,res){
    var sonum = (req.query.sonum != null)? req.query.sonum : req.query.webnum;
    var data = '',ponum,smnum,delivery,instructions;
    sql.execute({
        query: sql.fromFile("./sql/getOrderHeader.sql"),
        params: { sonum: sonum, custid: req.user.custid }
    }).then(function(result){
        if(result[0] == null){
            ponum = '';
            smnum = '';
            delivery = '';
            instructions = '';
        }
        else {
            ponum = result[0].ponum;
            smnum = result[0].smnum;
            delivery = result[0].delivery;
            instructions = result[0].instructions;
        }
    });
    sql.execute({
        query: sql.fromFile("./sql/getOrder.sql"),
        params: { sonum: sonum, custid: req.user.custid }
    }).then(function(result){
        if(result[0] == null) data = "An error occured when pulling up this order";
        else {
            if(result[0].line_seq_no != null) {
                for (var i = 0; i < result.length; i++) {
                    //priceLookup(result[i].item_no, result[i].qty_ordered, req.user.custid, function(obj){  console.log( JSON.parse(obj)[0].totalprice.toString()) ;     });
                    var j = i+1;
                    data = data + "<tr><td>" + result[i].line_seq_no + "</td><td><input id='qty"+j+"' value='" + result[i].qty_ordered + "' size='5' readonly></td><td>" + result[i].uom + "</td><td><input id='item"+j+"' value='" + result[i].item_no + "' readonly></td><td>" + result[i].item_desc_1 + "</td><td><input id = 'unit"+j+"' readonly></td><td><input id = 'subtotal"+j+"' readonly></td><td><select id='options"+j+"'></select></td></tr>";
                }
            }
            else if(result[0].ord_id != null){
                for(var i = 0; i < result.length; i++){
                    var j = i+1;
                    if(result[i].total == null)result[i].total = 0;
                    data = data + "<tr><td>"+j+"</td><td><input id='qty"+j+"' value='" + result[i].qty + "' size='5' readonly></td><td><input id='uom"+j+"' readonly></td><td><input id='item"+j+"' value='" + result[i].itemno + "' readonly></td><td><input id='item_desc"+j+"' readonly></td><td><input id='unit"+j+"' value='"+(result[i].total/result[i].qty).toFixed(2)+"'readonly></td><td><input id='subtotal"+j+"' value='"+result[i].total.toFixed(2)+"'readonly></td><td><select id='options"+j+"'></select></td></tr>";
                }

            }

        }
        res.render('ViewOrder',{user:req.user, ponum:ponum, smnum:smnum, delivery:delivery, instructions:instructions, data: data});
    });

});
customers.get('/cancel', function(req,res){

});
customers.get('/shoppingCart', loggedIn, function(req,res){
    var custid = req.user.custid;
    var ponum,smnum,delivery,instructions,ideal;
    sql.execute({
        query: sql.fromFile("./sql/getRegularOrderHeader.sql"),
        params: {custid: custid}
    }).then(function(result){
        if(result[0] != null) {
            ponum = result[0].ponum;
            smnum = result[0].smnum;
            delivery = result[0].delivery;
            instructions = result[0].instructions;
            ideal = result[0].ideal;
        }
    });
    sql.execute({
        query: sql.fromFile("./sql/getShoppingCart.sql"),
        params: {custid: custid, toggle: '1'}
    }).then(function(result){
        var data = '';
        for(var i = 1; i < result.length+1; i++){
            var j = i-1;
            data = data + "<tr><td>"+i+"</td><td><input type = 'text' id = 'item"+i+"' name = 'item"+i+"' value='"+result[j].itemno+"' style='border:none' readonly></td><td><input id='uom"+i+"' name = 'uom"+i+"' style='border:none' size='3' value='"+result[j].uom+"'readonly></td><td><input type = 'text' id = 'qty"+i+"' name = 'qty"+i+"' size='7' value='"+result[j].qty+"' style='border:none' readonly></td><td><input id='item_desc"+i+"' style='border:none' readonly></td><td><input id='unit"+i+"' name='unit"+i+"' style='border:none' readonly></td><td><input id='convert"+i+"' readonly hidden><input id='subtotal"+i+"' name = 'subtotal"+i+"' style='border:none' readonly></td><td><input type='button' value = 'Remove' onclick='remove("+i+");'></td></tr>";
        }
        res.render('PrintableOrder',{user:req.user, ponum:ponum, smnum:smnum, delivery:delivery, instructions:instructions, ideal: ideal, data:data});
    });
});
customers.get('/customCart',loggedIn,function(req,res){
    var ponum,smnum,delivery,instructions;
    sql.execute({
        query: sql.fromFile("./sql/getShoppingCart.sql"),
        params: {custid: req.user.custid, toggle: '0'}
    }).then(function(result) {
        if(result[0] != null) {
            ponum = result[0].po_number;
            smnum = result[0].sm;
            delivery = result[0].delivery;
            instructions = result[0].comment;
        }
        var data = '';
        for(var i = 1; i < result.length+1; i++) {
            var j = i - 1;
            if(result[j].comment == null)result[j].comment = '';
            data = data + "<tr><td>"+result[j].line_number+"</td><td><input type = 'text' id = 'item"+i+"' name = 'item"+i+"' value='"+result[j].item_number.trim()+"' size='15' style='border:none;' readonly></td><td><input type = 'text' id = 'qty"+i+"' name = 'qty"+i+"' size='5' value='"+result[j].qty+"'  readonly></td><td><input type = 'text' id = 'width"+i+"' name = 'width"+i+"' size='7' value='"+result[j].width+"' readonly></td><td><input type = 'text' id = 'height"+i+"' name = 'height"+i+"' size='7' value='"+result[j].height+"' readonly></td><td><input type = 'text' id = 'mt"+i+"' name = 'mt"+i+"' size='2' value='"+result[j].mount.trim()+"' readonly></td><td><input type = 'text' id = 'val"+i+"' name = 'val"+i+"' size='2' value='"+result[j].val_style.trim()+"' readonly></td><td><input type = 'text' id = 'valadd"+i+"' name = 'valadd"+i+"' size='4' value='"+result[j].val_add+"' readonly></td><td><input type = 'text' id = 'valrt"+i+"' name = 'valrt"+i+"' size='4' value='"+result[j].val_ret+"' readonly></td><td><input type = 'text' id = 'ct"+i+"' name = 'ct"+i+"' size='2' value='"+result[j].control+"' readonly>" +
                "<input type = 'text' id = 'tc"+i+"' name = 'tc"+i+"' size='3' value='"+result[j].tc+"' readonly hidden><input type = 'text' id = 'hd"+i+"' name = 'hd"+i+"' size='3' value='"+result[j].hd+"' readonly hidden><input type = 'text' id = 'comment"+i+"' name = 'comment"+i+"' value='"+result[j].comment+"' readonly hidden>"+
                "</td><td><input name = 'subtotal"+i+"'  size='10' value='"+result[j].subtotal.toFixed(2)+"'readonly></td><td><input type='button' value = 'Remove' style='border: ridge;' onclick='remove("+i+");'></td></tr>"
        }
        res.render('PrintableCustom', {user: req.user, ponum:ponum, smnum:smnum, delivery:delivery, instructions:instructions, data: data});
    });
});
customers.post('/confirmOrder', loggedIn, function(req,res){
    var ponum = req.body.PONUM;
    var smnum = req.body.SMNUM;
    var instructions = req.body.instructions;
    var delivery = req.body.delivery;
    var ideal = req.body.IDEAL;
    if(req.body['rowlength'] <= 1){
        req.session.error = "The shopping cart is empty";
        res.redirect('/customers/shoppingCart');
    }else {
        var data = 'REGULAR ORDER \n\n' + req.user.custid + '\n\n' + (new Date()).toDateString() + '\n' + 'PONUM: ' + ponum + '\n' + 'SIDEMARK: ' + smnum + '\n\n' + 'SHIPPING: ' + delivery + ' \n' + 'INSTRUCTIONS: ' + instructions + '\n' + 'IDEAL DELIVERY TIME: ' + ideal + '\n\n';
        try {
            for (var i = 1; i < req.body['rowlength']; i++) {
                var itemno = "item" + i;
                var qty = "qty" + i;
                var uom = "uom" + i;
                var unit = "unit" + i;
                var subtotal = "subtotal" + i;
                data = data + i + ': ' + req.body[itemno].trim() + '       '+req.body[uom].trim()+'   ' + req.body[qty] +  '   ' + req.body[unit] + '   ' + req.body[subtotal] + '\n';
            }
        }
        catch (err) {
            req.session.error = "Invalid page modification";
            req.redirect('/customers/shoppingCart');
        }

        pdfmaker.make_pdf(data, './order.pdf', 'portrait');
        mailer.mail('./order.pdf', req.user.custid);

        //create web order id, move everything from cart into order, clear cart
        sql.execute({
            query: sql.fromFile("./sql/clearCart.sql"),
            params: {custid: req.user.custid}
        });

        req.session.success = "Order confirmed and sent";
        res.redirect('/customers/thank');
    }
});
customers.post('/confirmCustom', loggedIn, function(req,res){
    var ponum = req.body.PONUM;
    var smnum = req.body.SMNUM;
    var instructions = req.body.instructions;
    var delivery = req.body.delivery;
    if(req.body['rowlength'] <= 1){
        req.session.error = "The shopping cart is empty";
        res.redirect('/customers/shoppingCart');
    }else {
        var data = 'CUSTOM ORDER \n\n ' + req.user.custid + '\n\n' + (new Date()).toDateString() + '\n' + 'PONUM: ' + ponum + '\n' + 'SIDEMARK: ' + smnum + '\n\n' + 'SHIPPING: ' + delivery + ' \n'+'INSTRUCTIONS: ' + instructions + '\n\n';
        try {
            for (var i = 1; i < req.body['rowlength']; i++) {
                data = data + "LN: " + i + '\n' + "PRODUCT: " + req.body['item'+i] + '\n' +
                    'QTY:' + req.body['qty'+i] + '\n' + 'WIDTHxHEIGHT: ' + req.body['width'+i] + ' X ' + req.body['height'+i] + '\n' + 'MT:' + req.body['mt'+i] + '\n' + 'VAL:' + req.body['val'+i] + '\n' + 'VAL ADD:' + req.body['valadd'+i] + '\n' + 'VAL RT:' + req.body['valrt'+i] + '\n' + 'CT:' + req.body['ct'+i] + '\n' +
                    'TC:' + req.body['tc'+i] + '\n' + 'HD:' + req.body['hd'+i] + '\n' + 'COMMENT: ' + req.body['comment'+i] + '\n' + '__________________________________________' + '\n';
            }
        }
        catch (err) {
            req.session.error = "Invalid page modification";
            req.redirect('/customers/shoppingCart');
        }

        pdfmaker.make_pdf(data, './order.pdf', 'landscape');
        mailer.mail('./order.pdf', req.user.custid);

        //create web order id, move everything from cart into order, clear cart
        sql.execute({
            query: sql.fromFile("./sql/confirmCustom.sql"),
            params: {custid: req.user.custid}
        });

        req.session.success = "Order confirmed and sent";
        res.redirect('/customers/thank');
    }
});
customers.post('/removeFromCart', loggedIn, function(req,res){
    var itemno = req.body.itemno;
    var uom = req.body.uom;
    console.log(uom);
    sql.execute({
        query: sql.fromFile('./sql/removeOrder.sql'),
        params: {custid: req.user.custid, itemno: itemno, uom:uom}
    });
    res.json({success : "Updated Successfully", status : 200});
});

customers.get('/thank', loggedIn, function(req,res){
   res.render('Thanks');
});

function loggedIn(req, res, next) {
    if (req.user && req.user.custid) {
        next();
    } else {
        res.redirect('/signin');
    }
}

exports.customers = customers;
module.exports= customers;