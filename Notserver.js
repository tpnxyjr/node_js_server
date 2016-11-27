var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var sql = require("seriate");
var when = require("when");

var config = {
    "server": "108.23.30.126",
    "user": "data",
    "password": "Cbc9096290869",
    "database": "ExcelDataImport"
};

sql.setDefaultConfig( config );

sql.execute( {
    query: "SELECT TOP 1 * FROM [ExcelDataImport].[dbo].[Barcode_Table]"
} ).then( function( results ) {
    console.log( "Database Connection Successful" );
}, function( err ) {
    console.log( "Something bad happened:", err );
} );

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        console.log('get');
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        console.log('post');
        processForm(req, res);
    }
});

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}


function processForm(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm();

    //insert here
    var sqlFile = './test.sql';
    sql.execute({
        query: sql.fromFile(sqlFile),
        params:{ test:"test" }
    }).then(function(result){
        console.log("success")
    })
    .catch(function(err){
        console.log("Error");
        console.log(err);
    });


    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
        fields[field] = value;
    });
    form.on('end', function () {
        console.log(fields['qty']);
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
    form.parse(req);
}

server.listen(1185);
console.log("server listening on 1185");