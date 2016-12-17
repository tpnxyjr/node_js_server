var express = require('express'),
    sql  = require("seriate"),
    path = require('path'),
    passport = require('passport');
var router = express.Router();
var myConfig = require('../config.js');
var config = myConfig.config;
sql.setDefaultConfig( config );
router.use(passport.initialize());
router.use(passport.session());
router.use(express.static(path.join(__dirname, 'public')));


router.get('/reports', function(req,res){
    res.render('DetailedReport',{SONUM: null,
        layout: 'internal'
    });
});
router.get('/ticketList',function(req,res){
    var sqlFile = './sql/gettickets.sql';
    var prerender = "";
    sql.execute({
        query: sql.fromFile(sqlFile),

    }).then(function (result) {
        var count = 0;
        for(count = 0; count < result.length; count++){
            //16, 24
            if(result[count].new_DeliveryDate == null)result[count].new_DeliveryDate= '                           ';
            prerender = prerender + "<tr><td>"+result[count].cus_no+"</td><td><a href='/routes/pickticket?SONUM="+result[count].ord_no + "'>"+result[count].ord_no+"</a></td><td style='color:black;font-size:0.5em;'>"+
                result[count].new_DeliveryDate.toString().substring(0,16)+
                "</td><td><div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:70%'>70%</div></div></td></tr>";
        }
        res.render('TicketList',{
            data: prerender,
            date: (new Date()),
            layout: 'date',
            user: req.user
        });

    },function (err) {
        console.log(err);
    });


});
router.get('/pickticket',function(req,res){//pticketcmt
    var sonum = req.query.SONUM;
    //check unfinished pick tickets checkforticket.sql
    var sqlFile = './sql/getSavedTicket.sql';
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {sonum: sonum}
    }).then(function (result) {
        if(result[0] != null) res.redirect('/usedpickticket?sonum='+sonum);
    },function (err) {
        console.log(err);
    });

    sqlFile = './sql/getpickticket.sql';
    var custname, custid, address, address2, citystatezip, shipvia, ponum, orddate, payment, shipinstruct, shipinstruct2,freight, weight, totalweight;
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {sonum: sonum}
    }).then(function (result) {
        custname = result[0].ship_to_name;
        custid = result[0].cus_no;
        address= result[0].ship_to_addr_1;
        address2 = result[0].ship_to_addr_2;
        citystatezip= result[0].ship_to_addr_4;
        shipvia= result[0].ship_via_cd;
        ponum= result[0].oe_po_num;
        orddate= result[0].ord_dt.toString().substring(3,16);
        payment= ((result[0].ar_terms_cd == 'CC')? "COD/CASH" : (result[0].ar_terms_cd == '01')? "COD/CHECK": (result[0].ar_terms_cd == 'PP')? "PREPAID" : (result[0].ar_terms_cd == 'PF')? "FAX COPY" :
            (result[0].ar_terms_cd == '15' || result[0].ar_terms_cd == '30' ||  result[0].ar_terms_cd == '10'  || result[0].ar_terms_cd == '3P')? "NET TERM" : result[0].ar_terms_cd);
        shipinstruct= result[0].ship_instruction_1;
        shipinstruct2 = result[0].ship_instruction_2;
        freight = result[0].ship_to_addr_3;


        var prerender = "<thead><tr><th class='gray'>LN</th><th class='gray'>ORDERED</th><th class='gray'>UOM</th><th class='gray'>ITEM NO</th><th class='gray'>PICKED</th><th class='gray'>PACK</th><th class='gray' id='desctitle' style='display:none;'>ITEM DESCRIPTION/PACKAGING</th></tr></thead>";
        sql.execute({
            query: sql.fromFile("./sql/getorderlines.sql"),
            params: {sonum: sonum}
        }).then(function (result) {
            totalweight = 0;
            prerender = prerender + "<tbody>";
            for(var i = 0; i < result.length; i++){
                weight = Math.round(1.10*(result[i].item_weight)*(result[i].qty_ordered));
                totalweight += weight;
                if(result[i].picking_seq == null) result[i].picking_seq = " ";
                if(isNaN(parseInt(result[i].user_def_fld_2 ))) result[i].user_def_fld_2 = " ";
                if(result[i].user_def_fld_1 == null) result[i].user_def_fld_1 = " ";

                prerender = prerender + "<tr><td><img id='image"+i+"' src='../image/CheckMark.jpg' style='display:none;'/><p onclick='showComment("+i+")'>"+result[i].line_seq_no+"</p><input type='hidden' name='lineno"+i+"' value='"+i+"'></td>" +
                    "<td><p style='font-size:0.5em;'>"+result[i].qty_ordered+"</p><b>"+result[i].qty_ordered/parseInt(result[i].user_def_fld_2)+"</b></td><td><p style='font-size:0.5em;'>"+ result[i].uom+"</p><b>"+result[i].user_def_fld_1+"" +
                    "</b></td><td><p onclick='show("+i+")' style='width:6em'><input name='itemno"+i+"' class='itemnobox' value='"+result[i].item_no+"' readonly></p><p style='font-size:0.5em;'>"+result[i].qty_on_hand+"</p></td>" +
                    "<td style='font-size:1.8em;'><input id='CheckValue"+i+"' type='text' maxlength='2' onchange='compare("+i+","+result[i].qty_ordered/parseInt(result[i].user_def_fld_2)+")' style='font-size:1em;width:1.1em;height:1em;vertical-align:middle;'>"+result[i].user_def_fld_1+"</td>"+
                    "<td><select name='pack"+i+"'><option value='BOX'>BOX</option><option value='PALLET'>PALLET</option><option value='BUNDLE'>BUNDLE</option></select><select name='pcode"+i+"' style='width:40px;'><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></td></tr>" +
                    "<tr id='desc"+i+"' style='display:none;'><td class='infobox' colspan='6'>"+result[i].item_desc_1+"<b>"+result[i].item_desc_2+"</b>ORDER DETAIL COMMENT INTERNAL DETAIL COMMENT<b>"+weight+"LB</b>"+ result[i].picking_seq+"</td></tr>";


                prerender = prerender + "<tr id='comment"+i+"' style='display:none'><td colspan='6'><input name='comment"+i+"' type='text' style='color:red;width:20em' placeholder='input comment for line"+(i+1)+"'><a href='/workers/viewcomments?sonum="+sonum+"'\&lineno="+i+"> <input type='button' value='View Comments' /></a></td></tr>";

            }
            prerender = prerender + "</tbody>";

            res.render('PickTicket',{
                datetime: (new Date()).toLocaleDateString(),
                ordnum: sonum,
                custname: custname,
                custid: custid,
                address: address,
                address2: address2,
                citystatezip: citystatezip,
                shipvia: shipvia,
                ponum: ponum,
                orddate: orddate,
                payment: payment,
                shipinstruct: shipinstruct,
                shipinstruct2: shipinstruct2,
                freight: freight,
                data: prerender,
                totalweight: totalweight,
                totallines: i,
                addcomment: '',
                layout: 'internal',
                user: req.user
            });
        },function (err) {
            console.log(err);
            res.redirect('/routes/ticketList');
        });




    },function (err) {
        console.log(err);
    });

});

router.get('/usedpickticket',function(req,res){
    var sonum = req.query.SONUM;
    var sqlFile = './sql/getSavedTicket.sql';
    var custname, custid, address, address2, citystatezip, shipvia, ponum, orddate, payment, shipinstruct, shipinstruct2,freight, weight, totalweight;
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {sonum: sonum}
    }).then(function (result) {
        custname = result[0].ship_to_name;
        custid = result[0].cus_no;
        address= result[0].ship_to_addr_1;
        address2 = result[0].ship_to_addr_2;
        citystatezip= result[0].ship_to_addr_4;
        shipvia= result[0].ship_via_cd;
        ponum= result[0].oe_po_num;
        orddate= result[0].ord_dt.toString().substring(3,16);
        payment= ((result[0].ar_terms_cd == 'CC')? "COD/CASH" : (result[0].ar_terms_cd == '01')? "COD/CHECK": (result[0].ar_terms_cd == 'PP')? "PREPAID" : (result[0].ar_terms_cd == 'PF')? "FAX COPY" :
            (result[0].ar_terms_cd == '15' || result[0].ar_terms_cd == '30' ||  result[0].ar_terms_cd == '10'  || result[0].ar_terms_cd == '3P')? "NET TERM" : result[0].ar_terms_cd);
        shipinstruct= result[0].ship_instruction_1;
        shipinstruct2 = result[0].ship_instruction_2;
        freight = result[0].ship_to_addr_3;
        var prerender = "<thead><tr><th class='gray'>LN</th><th class='gray'>ORDERED</th><th class='gray'>UOM</th><th class='gray'>ITEM NO</th><th class='gray'>PICKED</th><th class='gray'>PACK</th><th class='gray' id='desctitle' style='display:none;'>ITEM DESCRIPTION/PACKAGING</th></tr></thead>";

        for(var i = 0; i < result.length; i++) {
            totalweight += result[i].weight;
            prerender = prerender + "<tr><td><img id='image"+i+"' src='../image/CheckMark.jpg' style='display:none;'/><p onclick='showComment("+i+")'>"+result[i].line_seq_no+"</p><input type='text' name='lineno"+i+"' value='"+i+"'type='hidden'></td>" +
                "<td><p style='font-size:0.5em;'>"+result[i].qty_ordered+"</p><b>"+result[i].qty_ordered/parseInt(result[i].user_def_fld_2)+"</b></td><td><p style='font-size:0.5em;'>"+ result[i].uom+"</p><b>"+result[i].user_def_fld_1+"" +
                "</b></td><td><p onclick='show("+i+")' style='width:6em'><input name='itemno"+i+"' class='itemnobox' value='"+result[i].item_no+"' readonly></p><p style='font-size:0.5em;'>"+result[i].qty_on_hand+"</p></td>" +
                "<td style='font-size:1.8em;'><input id='CheckValue"+i+"' type='text' maxlength='2' onchange='compare("+i+","+result[i].qty_ordered/parseInt(result[i].user_def_fld_2)+")' style='font-size:1em;width:1.1em;height:1em;vertical-align:middle;'value='"+result[i].picked+"'>"+result[i].user_def_fld_1+"</td>"+
                "<td><select name='pack"+i+"' value='"+result[i].pack+"'><option value='BOX'>BOX</option><option value='PALLET'>PALLET</option><option value='BUNDLE'>BUNDLE</option></select><select name='pcode"+i+"' style='width:40px;' value='"+result[i].pcode+"'><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></td></tr>" +
                "<tr id='desc"+i+"' style='display:none;'><td class='infobox' colspan='6'>"+result[i].item_desc_1+"<b>"+result[i].item_desc_2+"</b>ORDER DETAIL COMMENT INTERNAL DETAIL COMMENT<b>"+weight+"LB</b>"+ result[i].bay_loc+"</td></tr>";


            prerender = prerender + "<tr id='comment"+i+"' style='display:none'><td colspan='6'><input name='comment"+i+"' type='text' style='color:red;width:20em' placeholder='input comment for line"+(i+1)+"'><a href='/workers/viewcomments?sonum="+sonum+"'\&lineno="+i+"> <input type='button' value='View Comments' /></a></td></tr>";

        }
        prerender = prerender + "</tbody>";
        res.render('PickTicket',{
            datetime: (new Date()).toLocaleDateString(),
            ordnum: sonum,
            custname: custname,
            custid: custid,
            address: address,
            address2: address2,
            citystatezip: citystatezip,
            shipvia: shipvia,
            ponum: ponum,
            orddate: orddate,
            payment: payment,
            shipinstruct: shipinstruct,
            shipinstruct2: shipinstruct2,
            freight: freight,
            data: prerender,
            totalweight: totalweight,
            totallines: i,
            addcomment: '',
            layout: 'internal',
            user: req.user
        });

    },function (err) {
        console.log(err);
        res.redirect('/routes/ticketList');
    });

});

router.post('/pickticket',function(req,res){
    var total = req.body.totallines;
    var temp, comment, lineno, qty, uom, itemno, qtyonhand, picked, pack, item1, item2, weight, pcode, bayloc;
    for(var i = 0; i < total; i ++){
        temp = 'comment'+i;
        comment = req.body[temp];
        temp = 'itemno'+i;
        itemno = req.body[temp];
        temp = 'CheckValue'+i;
        picked = req.body[temp];
        temp = 'pack'+i;
        pack = req.body[temp];
        temp = 'pcode'+i;
        pcode = req.body[temp];
        temp = 'lineno'+i;
        lineno = req.body[temp];

        console.log(lineno);
        console.log(comment);
        console.log(itemno);

        if(comment != "") {
            sql.execute({
                query: sql.fromFile("./sql/insertComment.sql"),
                params: {sonum: req.body.sonum, lineno: lineno, commentnum: new Date().valueOf(), comment: comment}
            });
        }

        console.log("complete? "+ req.body.complete);
        if(req.body.complete == false){
            //save into incomplete incompticket
            var sqlFile = './sql/saveTicket.sql';
            sql.execute({
                query: sql.fromFile(sqlFile),
                params: {sonum: sonum,
                    lineno: lineno,
                    qty: qty,
                    uom: uom,
                    itemno: itemno,
                    qtyonhand: qtyonhand,
                    picked: picked,
                    pack: pack,
                    pcode: pcode,
                    item1: item1,
                    item2: item2,
                    weight: weight,
                    bayloc: bayloc
                }
            }).then(function (result) {
            },function (err) {
                console.log(err);
            });

        }
        else {
            //go through all lines and subtract from inventory
            //oeordlin qty_to_ship
        }
    }
    res.redirect('/routes/ticketList');
});
router.get('/DetailedReport',function(req,res){
    var data = "";
    sql.execute({
        query: "./sql/getSOprogress.sql",
        params:{sonum: req.body.SONUM}
    }).then(function(result){
        var count = 0;
        var denom = 0;
        var numer = 0;
        var lineno = result[count].line_no;

        for(count = 0; count < result.length; count++) {
            if (lineno.equals(result[count].line_no)) {
                var timecreate = result[count].timecreate;
                var timefin = result[count].timefin;
                if (timecreate != null)denom++;
                if (timefin != null)numer++;
            }
            else {
                //data.push(lineno);
                data += "<tr><td>" + lineno + "</td>";
                //data.push((numer/denom).toString());
                data += "<td>" + numer / denom + "</td>";
                data += "<td><input id='weight"+count+"' type='text'></td></tr>";
            }
        }
        data+="<tr><td style='display:none;'><input type='text' id='total' value='"+count+"'></td></tr>";
        //var datastringify = JSON.stringify(data);
        res.render('DetailedReport',{SONUM: req.body.SONUM,
                                    data: data});
    },function (err) {
        console.log(err);
    });

});
exports.router = router;
module.exports= router;
