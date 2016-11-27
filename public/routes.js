var express = require('express');
var router = express.Router();
var sql  = require("seriate");
var config = {
    "server": "108.23.30.126",
    "user": "data",
    "password": "Cbc9096290869",
    "database": "ExcelDataImport"
};
// require('./config').config;
sql.setDefaultConfig( config );


router.get('/reports', function(req,res){
    res.render('DetailedReport',{SONUM: null});
});
router.get('/pickticket',function(req,res){
    var sonum = req.query.SONUM;

   res.render('PickTicket',{

   });
});
router.get('/DetailedReport',function(req,res){
    var data = [];
    sql.execute({
        query: "./public/sql/getSOprogress.sql",
        params:{sonum: req.body.SONUM}
    }).then(function(result){
        var count = 0;
        var denom = 0;
        var numer = 0;
        var lineno = result[count].line_no;

        while(result[count] != null) {
            if (lineno.equals(result[count].line_no)) {
                var timecreate = result[count].timecreate;
                var timefin = result[count].timefin;
                if (timecreate != null)denom++;
                if (timefin != null)numer++;
            }
            data.push(lineno);
            data.push((numer/denom).toString());
            count++;
        }
        var datastringify = JSON.stringify(data);
        res.render('DetailedReport',{SONUM: req.body.SONUM,
                                    data: datastringify});
    },function (err) {
        console.log(err);
    });

});
module.exports = router;

