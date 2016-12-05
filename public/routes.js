var express = require('express');
var router = express.Router();
var sql  = require("seriate");
var myConfig = require('../config.js');
var config = myConfig.config;
sql.setDefaultConfig( config );


router.get('/reports', function(req,res){
    res.render('DetailedReport',{SONUM: null,
        layout: 'internal'
    });
});
router.get('/pickticket',function(req,res){
    var sonum = req.query.SONUM;

   res.render('PickTicket',{

   });
});
router.get('/DetailedReport',function(req,res){
    var data = "";
    sql.execute({
        query: "./public/sql/getSOprogress.sql",
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
