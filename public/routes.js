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
        for(var count = 0; count < result.length; count++){
            //16, 24

            if(result[count].new_DeliveryDate == null)result[count].new_DeliveryDate= '                           ';
            prerender = prerender + "<tr><td>"+result[count].cus_no+"</td><td><a href='/routes/pickticket?SONUM="+result[count].ord_no + "'>"+result[count].ord_no+"</a></td><td style='color:black;font-size:0.5em;'>"+
                result[count].new_DeliveryDate.toString().substring(0,16)+"</td>";
            if(result[count].user_def_fld_1 != null) prerender = prerender + "<td style='color:red'>YES</td>";
            else prerender=prerender+ "<td style='color:GREEN'>NO</td>";
            prerender = prerender +"</tr>";
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
        if(result == null)res.redirect('error');
        if(result[0].pack != null) res.redirect('/routes/usedpickticket?sonum='+sonum);
    else {

            sqlFile = './sql/getpickticket.sql';
            var custname, custid, address, address2, citystatezip, shipvia, ponum, orddate, payment, shipinstruct, shipinstruct2, freight, weight, totalweight, addcomment, updatetime;
            sql.execute({
                query: sql.fromFile(sqlFile),
                params: {sonum: sonum}
            }).then(function (result) {
                if(result[0].user_def_fld_2 != null)updatetime = result[0].user_def_fld_2.replace(/\s+$/, '');
                else updatetime = (new Date()).toString().substring(0,16);
                custname = result[0].ship_to_name;
                custid = result[0].cus_no;
                address = result[0].ship_to_addr_1;
                address2 = result[0].ship_to_addr_2;
                citystatezip = result[0].ship_to_addr_4;
                shipvia = result[0].ship_via_cd;
                ponum = result[0].oe_po_no;
                orddate = result[0].ord_dt.toString().substring(3, 16);
                payment = ((result[0].ar_terms_cd == 'CC') ? "COD/CASH" : (result[0].ar_terms_cd == '01') ? "COD/CHECK" : (result[0].ar_terms_cd == 'PP') ? "PREPAID" : (result[0].ar_terms_cd == 'PF') ? "FAX COPY" :
                    (result[0].ar_terms_cd == '15' || result[0].ar_terms_cd == '30' || result[0].ar_terms_cd == '10' || result[0].ar_terms_cd == '3P') ? "NET TERM" : result[0].ar_terms_cd);
                shipinstruct = result[0].ship_instruction_1;
                shipinstruct2 = result[0].ship_instruction_2;
                freight = result[0].ship_to_addr_3;
                if(result[0].user_def_fld_1 != null) addcomment = result[0].user_def_fld_1.trim();
                else addcomment = "";

                var prerender = "";
                sql.execute({
                    query: sql.fromFile("./sql/getorderlines.sql"),
                    params: {sonum: sonum}
                }).then(function (result) {
                    totalweight = 0;
                    prerender = prerender + "<tbody>";
                    for (var i = 0; i < result.length; i++) {
                        weight = Math.round(1.10 * (result[i].item_weight) * (result[i].qty_ordered));
                        totalweight += weight;
                        if (result[i].picking_seq == null) result[i].picking_seq = " ";
                        if (isNaN(parseInt(result[i].user_def_fld_2))) result[i].user_def_fld_2 = " ";
                        if (result[i].user_def_fld_1 == null) result[i].user_def_fld_1 = " ";
                        if(result[i].user_def_fld_2.trim() == "") result[i].user_def_fld_2 = 1;
                        var temp = result[i].qty_ordered / parseInt(result[i].user_def_fld_2);
                        if(result[i].item_no.trim().substr(0,3) == "INV") prerender = prerender + "<tr style='display:none'>";
                        else prerender = prerender + "<tr>";
                        prerender = prerender + "<td rowspan='2'><img id='imagea" + i + "' src='../image/CheckMark.jpg' style='display:none;'/><img id='imageb" + i + "' src='../image/o.jpg' style='display:none;'/><img id='imagec" + i + "' src='../image/x.png' style='display:none;'/><p onclick='showComment(" + i + ")'>" + result[i].line_seq_no + "</p><input type='hidden' name='lineno" + i + "' value='" + i + "'></td>" +
                            "<td rowspan='2'><p style='font-size: 0.5em;'>" + result[i].qty_ordered + "</p><p style='font-size: 1.5em;'><b>" + temp.toFixed(2).replace(/[.,]00$/, "") + "</b></p></td>" +
                            "<td rowspan='2'><p style='font-size: 0.5em;'>" + result[i].uom + "</p><p id='converted"+i+"' style='font-size: 1.5em;'><b>" + result[i].user_def_fld_1 + "</b></p></td>" +
                            "<td colspan='4'><p onclick='show(" + i + ")' style='font-size:1.5em;'><input name='itemno" + i + "' class='itemnobox' value='" + result[i].item_no.trim() + "' readonly></p></td></tr>";

                        if(result[i].item_no.trim().substr(0,3) == "INV") prerender = prerender + "<tr style='display:none'><td>";
                        else prerender = prerender + "<tr><td>";

                        if (result[i].commented2 == 1) prerender = prerender + "<a href='/routes/viewordercomments?sonum=" + sonum + "\&lineno=" + (i+1) + "'><input type='button' value='C' /></a>";

                        prerender = prerender + "</td><td><p style='font-size: 0.5em;'>" + result[i].qty_on_hand + "</p></td><td style='font-size:1.8em;'><input id='multiplier"+i+"' value='"+parseInt(result[i].user_def_fld_2)+"' hidden><input id='CheckValue" + i + "' name='CheckValue" + i + "' type='text' maxlength='3' onchange='compare(" + i + ")' style='font-size:1em;width:1.1em;height:1em;vertical-align:middle;'><input type='text' id='CheckFieldB"+i+"' name='CheckFieldB" + i + "' maxlength='4' style='width:30px;position:absolute;' value='"+result[i].user_def_fld_1+"'><select id='CheckValueB" + i + "' name='CheckValueB" + i + "' style='position:relative;' onchange='compare(" + i + "); document.getElementById(\"CheckFieldB"+i+"\").value = this.options[ this.selectedIndex ].text;;'><option value='"+result[i].qty_ordered+"'>"+ result[i].uom +"</option><option value = '"+temp+"' selected='selected'>" + result[i].user_def_fld_1 + "</option></select></td>" +
                            "<td><p><input type='text' id='packfield"+i+"' name='packfield"+i+"'style='width:60px;' value='BOX'><input type='text' id='pickfield"+i+"' name='pickfield"+i+"'style='width:60px;' VALUE='A'></p>" +
                            "<select name='pack" + i + "' onchange='document.getElementById(\"packfield"+i+"\").value = this.value'><option value='BOX'>BOX</option><option value='PALLET'>PALLET</option><option value='BUNDLE'>BUNDLE</option></select>" +
                            "<select name='pcode" + i + "'  onchange='document.getElementById(\"pickfield"+i+"\").value = (document.getElementById(\"pickfield"+i+"\").value == \"\")?this.value: document.getElementById(\"pickfield"+i+"\").value + \",\"+this.value'><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select><button type='button' onclick='document.getElementById(\"pickfield"+i+"\").value = \"\"'>Clear</button></td></tr>" +

                            "<tr id='desc" + i + "' style='display:none;'><td class='infobox' colspan='6'>" + result[i].item_desc_1 + "<b>" + result[i].item_desc_2 + "</b><b>" + weight + "LB</b><input type='hidden'name='weight" + i + "'value='" + weight + "'>" + result[i].picking_seq + "</td></tr>";


                        prerender = prerender + "<tr id='comment" + i + "' style='display:none'><td colspan='6'><input name='comment" + i + "' type='text' style='color:red;width:20em;font-size:18pt;' placeholder='input comment for line" + (i + 1) + "'></td></tr>";

                    }
                    prerender = prerender + "</tbody>";

                    res.render('PickTicket', {
                        datetime: updatetime,
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
                        totalrows: 0,
                        addcomment: addcomment,
                        layout: 'internal',
                        user: req.user
                    });
                }, function (err) {
                    console.log(err);
                    res.redirect('/routes/ticketList');
                });

            }, function (err) {
                console.log(err);
            });

        }
    },function (err) {
        console.log(err);
    });

});

router.get('/usedpickticket',function(req,res){
    var sonum = req.query.sonum;
    var sqlFile = './sql/getpickticket.sql';
    var custname, custid, address, address2, citystatezip, shipvia, ponum, orddate, payment, shipinstruct, shipinstruct2,freight, totalweight, commented, addcomment, updatetime, hiddenlines=0;
    sql.execute({
        query: sql.fromFile(sqlFile),
        params: {sonum: sonum}
    }).then(function (result) {
        if(result[0].user_def_fld_2 != null)updatetime = result[0].user_def_fld_2.replace(/\s+$/, '');
        else updatetime = (new Date()).toString().substring(0,16);
        custname = result[0].ship_to_name;
        custid = result[0].cus_no;
        address= result[0].ship_to_addr_1;
        address2 = result[0].ship_to_addr_2;
        citystatezip= result[0].ship_to_addr_4;
        shipvia= result[0].ship_via_cd;
        ponum= result[0].oe_po_no;
        orddate= result[0].ord_dt.toString().substring(3,16);
        payment= ((result[0].ar_terms_cd == 'CC')? "COD/CASH" : (result[0].ar_terms_cd == '01')? "COD/CHECK": (result[0].ar_terms_cd == 'PP')? "PREPAID" : (result[0].ar_terms_cd == 'PF')? "FAX COPY" :
            (result[0].ar_terms_cd == '15' || result[0].ar_terms_cd == '30' ||  result[0].ar_terms_cd == '10'  || result[0].ar_terms_cd == '3P')? "NET TERM" : result[0].ar_terms_cd);
        shipinstruct= result[0].ship_instruction_1;
        shipinstruct2 = result[0].ship_instruction_2;
        freight = result[0].ship_to_addr_3;
        if(result[0].user_def_fld_1 != null) addcomment = result[0].user_def_fld_1.trim();
        else addcomment = "";

        var prerender = "";

        sql.execute({
            query: sql.fromFile("./sql/getSavedTicket.sql"),
            params: {sonum: sonum}
        }).then(function (result) {
            totalweight = 0;
            prerender = prerender + "<tbody>";
            for (var i = 0; i < result.length; i++) {
                    if (result[i].picking_seq == null) result[i].picking_seq = " ";
                    if (isNaN(parseInt(result[i].user_def_fld_2))) result[i].user_def_fld_2 = " ";
                    if (result[i].user_def_fld_1 == null) result[i].user_def_fld_1 = " ";
                    totalweight += result[i].weight;
                    if (result[i].user_def_fld_2.trim() == "") result[i].user_def_fld_2 = 1;
                    if(result[i].item_no.trim().substr(0,3) == "INV") prerender = prerender + "<tr style='display:none'>";
                    else prerender = prerender + "<tr>";
                    prerender = prerender + "<td rowspan='2'><img id='imagea" + i + "' src='../image/CheckMark.jpg' style='display:none;'/><img id='imageb" + i + "' src='../image/o.jpg' style='display:none;'/><img id='imagec" + i + "' src='../image/x.png' style='display:none;'/><p onclick='showComment(" + i + ")'>" + result[i].line_seq_no + "</p>";
                    commented = result[i].commented;
                    if (commented == 1) prerender = prerender + "<img src='../image/star.png'>";
                    var temp = result[i].qty_ordered / parseInt(result[i].user_def_fld_2);
                    if(result[i].picked == null) result[i].picked = 0;

                    prerender = prerender + "<input type='hidden' name='lineno" + i + "' value='" + i + "'type='hidden'></td>" +
                        "<td rowspan='2'><p style='font-size: 0.5em;'>" + result[i].qty_ordered + "</p><p style='font-size: 1.5em;'><b>" + temp.toFixed(2).replace(/[.,]00$/, "") + "</b></p></td>" +
                        "<td rowspan='2'><p style='font-size: 0.5em;'>" + result[i].uom + "</p><p id='converted"+i+"' style='font-size: 1.5em;'><b>" + result[i].user_def_fld_1 + "</b></p>" +
                        "</b></td><td colspan='4'><p onclick='show(" + i + ")' style='width:6em; font-size:1.5em;'><input name='itemno" + i + "' class='itemnobox' value='" + result[i].item_no.trim() + "' readonly></p></td></tr>";
                if(result[i].item_no.trim().substr(0,3) == "INV") prerender = prerender + "<tr style='display:none'><td>";
                else prerender = prerender + "<tr><td>";

                    if (result[i].commented2 == 1) prerender = prerender + "<a href='/routes/viewordercomments?sonum=" + sonum + "\&lineno=" + (i+1) + "'><input type='button' value='C' /></a>";

                    prerender = prerender + "</td><td><p style='font-size: 0.5em;'>" + result[i].qty_on_hand + "</p></td><td style='font-size:1.8em;'><input id='multiplier"+i+"' value='"+parseInt(result[i].user_def_fld_2)+"' hidden><input id='CheckValue" + i + "' name='CheckValue" + i + "' type='text' maxlength='3' onchange='compare(" + i + ")' style='font-size:1em;width:1.1em;height:1em;vertical-align:middle;' value='" + result[i].picked + "'><input type='text' id='CheckFieldB" + i + "' name='CheckFieldB" + i + "' maxlength='4' style='width:30px;position:absolute;' value='" + result[i].pickeduom + "'><select id='CheckValueB" + i + "' name='CheckValueB" + i + "' style='position:relative;' onchange='compare(" + i + ");document.getElementById(\"CheckFieldB" + i + "\").value = this.options[ this.selectedIndex ].text;'><option value='" + result[i].qty_ordered + "'>" + result[i].uom + "</option><option value = '" + temp + "' ";
                    if (result[i].user_def_fld_1 == null)result[i].user_def_fld_1 = "";
                    if (result[i].pickeduom == null)result[i].pickeduom = "";
                    if (result[i].pickeduom.trim() == result[i].user_def_fld_1.trim())
                        prerender = prerender + "selected='selected'";

                    prerender = prerender + ">" + result[i].user_def_fld_1 + "</option></select></td>" +
                        "<td><p><input type='text' id='packfield" + i + "' name='packfield" + i + "' style='width:60px;'value='" + result[i].pack + "'><input type='text'id='pickfield" + i + "'name='pickfield" + i + "'style='width:60px;'value='" + result[i].pcode.trim() + "'></p>" +
                        "<select name='pack" + i + "' onchange='document.getElementById(\"packfield" + i + "\").value = this.value'><option value='BOX'>BOX</option><option value='PALLET'>PALLET</option><option value='BUNDLE'>BUNDLE</option></select>" +
                        "<select name='pcode" + i + "' style='width:40px;' onchange='document.getElementById(\"pickfield" + i + "\").value = (document.getElementById(\"pickfield" + i + "\").value == \"\")?this.value: document.getElementById(\"pickfield" + i + "\").value + \",\"+this.value'><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select><button type='button' onclick='document.getElementById(\"pickfield" + i + "\").value = \"\"'>Clear</button></td></tr>" +
                        "<tr id='desc" + i + "' style='display:none;'><td class='infobox' colspan='6'>" + result[i].item_desc_1 + "<b>" + result[i].item_desc_2 + "</b><b>" + result[i].weight + "LB</b><input type='hidden'name='weight" + i + "'value='" + result[i].weight + "'>" + result[i].picking_seq + "</td></tr>";

                    prerender = prerender + "<tr id='comment" + i + "' style='display:none'><td colspan='6'><input name='comment" + i + "' type='text' style='color:red;width:20em;font-size:18pt;' placeholder='input comment for line" + (i + 1) + "'><a href='/routes/viewcomments?sonum=" + sonum + "\&lineno=" + i + "'><input type='button' value='View Comments' /></a></td></tr>";
            }

        prerender = prerender + "</tbody>";

        var shippingdata = "", totalrows = 0;
        sql.execute({
            query: sql.fromFile("./sql/loadshippinginfo.sql"),
            params: {sonum: sonum}
        }).then(function (result) {
            for (var j = 0; j < result.length; j++) {
                shippingdata = shippingdata + "<tr><td><input type='text' id='inside"+(j+1)+"at0' name='inside"+(j+1)+"at0' size=\"5\" value='"+result[j].type+"'></td><td><input type='text' id='inside"+(j+1)+"at1' name='inside"+(j+1)+"at1' size=\"5\" value='"+result[j].length+"'</td><td><input type='text' id='inside"+(j+1)+"at2' name='inside"+(j+1)+"at2' size=\"5\" value='"+result[j].width+"'</td><td><input type='text' id='inside"+(j+1)+"at3' name='inside"+(j+1)+"at3' size=\"5\" value='"+result[j].height+"'</td><td><input type='text' id='inside"+(j+1)+"at4' name='inside"+(j+1)+"at4' size=\"5\" value='"+result[j].weight+"' onchange='total(\"dimension\")'</td></tr>";
                totalrows++;
            }



        res.render('PickTicket',{
            datetime: updatetime,
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
            shippingdata:shippingdata,
            totalweight: totalweight,
            totallines: (i-hiddenlines),
            totalrows: totalrows,
            addcomment: addcomment,
            layout: 'internal',
            user: req.user
        });
        }, function (err) {
            console.log(err);
            res.redirect('/routes/ticketList');
        });
        });
    },function (err) {
        console.log(err);
        res.redirect('/routes/ticketList');
    });

});

router.post('/pickticket',function(req,res){
    var total = req.body.totallines;
    var temp, comment, lineno, itemno, picked, pickeduom, pack, weight, pcode, commented, addcomment = req.body.addcomment.toUpperCase();
    var type, len, width, height, weight;
    sql.execute({
        query: sql.fromFile('./sql/addcomment.sql'),
        params: {addcomment: addcomment, sonum:req.body.sonum}
    });

    //remove old saved data
   // if(req.body.complete == 'false') {
        sql.execute({
            query: sql.fromFile('./sql/deletesavedticket.sql'),
            params: {sonum: req.body.sonum}
        }).then(function(result){


        for (var i = 0; i < total; i++) {
            temp = 'comment' + i;
            comment = req.body[temp];
            temp = 'itemno' + i;
            itemno = req.body[temp];
            temp = 'CheckValue' + i;
            picked = req.body[temp];
            temp = 'CheckFieldB' + i;
            pickeduom = req.body[temp];
            temp = 'packfield' + i;
            pack = req.body[temp];
            temp = 'pickfield' + i;
            pcode = req.body[temp];
            temp = 'lineno' + i;
            lineno = req.body[temp];
            temp = 'weight' + i;
            weight = req.body[temp];
            commented = 0;

            //save comment

            if (comment != "") {
                comment = comment.toUpperCase();
                sql.execute({
                    query: sql.fromFile("./sql/insertComment.sql"),
                    params: {
                        sonum: req.body.sonum,
                        lineno: lineno,
                        commentnum: (new Date().valueOf()).toString(),
                        comment: comment,
                        author: req.user
                    }
                });
                commented = 1;
            }
console.log(lineno + ":" + picked);
            //save ticket
            sql.execute({
                query: sql.fromFile('./sql/saveTicket.sql'),
                params: {
                    sonum: req.body.sonum,
                    lineno: lineno,
                    itemno: itemno,
                    picked: picked,
                    uom: pickeduom,
                    pack: pack,
                    pcode: pcode,
                    weight: weight,
                    commented: commented
                }
            });

            //change qtytoship
            if (req.body.complete == "true") {
                sql.execute({
                    query: sql.fromFile('./sql/deductInv.sql'),
                    params: {
                        qty: picked,
                        ordno: ("     " + req.body.sonum).slice(-8),
                        itemno: itemno
                    }
                });
            }
        }
            for(var j = 0; j < req.body.totalrows; j++ ){
                //save shipping table
                temp = "inside"+(j+1)+"at"+0;
                type = req.body[temp];
                temp= "inside"+(j+1)+"at"+0+"a";
                if(req.body[temp] != null)type += " " + req.body[temp];
                temp = "inside"+(j+1)+"at"+1;
                len = req.body[temp];
                temp = "inside"+(j+1)+"at"+2;
                width = req.body[temp];
                temp = "inside"+(j+1)+"at"+3;
                height = req.body[temp];
                temp = "inside"+(j+1)+"at"+4;
                weight = req.body[temp];
                sql.execute({
                    query: sql.fromFile('./sql/saveshippinginfo.sql'),
                    params: {
                        sonum: req.body.sonum,
                        lineno: j,
                        type: type,
                        len: len,
                        width: width,
                        height: height,
                        weight: weight
                    }
                });
            }
        },function (err) {
            console.log(err);
        });



    if(req.body.complete == "true")res.redirect('/routes/ticketList');
    else res.redirect('/routes/usedpickticket?sonum='+req.body.sonum);
});

router.get('/viewcomments', function(req,res){
    var sonum = req.query.sonum;
    var lineno = req.query.lineno;
    var prerender = "<table style='font-size:20pt;'><tr><th>Time</th><th colspan='2'>Comment</th><th>Author</th></tr>";
    sql.execute({
        query: sql.fromFile("./sql/getComments.sql"),
        params: {sonum: sonum, lineno: lineno}
    }).then(function (result) {

        for(var i = 0; i < result.length; i++) {
            prerender = prerender + "<tr><td>"+new Date(parseInt(result[i].comment_num)).toString().substring(0,16) + "</td><td colspan='2'> "+ result[i].comment +"</td><td>"+result[i].author+"</td></tr>";
        }
        prerender = prerender + "</table>";
        res.render('blank',{data: prerender, layout: 'date'});
    },function (err) {
        console.log(err);
    });
});

router.get('/viewordercomments', function(req,res){
    var sonum = req.query.sonum;
    var lineno = req.query.lineno;
    var prerender = "<table style='font-size:20pt;'><tr><th>Line</th><th colspan='2'>Comment</th></tr>";
    sql.execute({
        query: sql.fromFile("./sql/getOrderComments.sql"),
        params: {sonum: sonum, lineno: lineno}
    }).then(function (result) {

        for(var i = 0; i < result.length; i++) {
            prerender = prerender + "<tr><td>"+result[i].comment_num + "</td><td colspan='2'> "+ result[i].comment +"</td></tr>";
        }
        prerender = prerender + "</table>";
        res.render('blank',{data: prerender, layout: 'date'});
    },function (err) {
        console.log(err);
    });
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
