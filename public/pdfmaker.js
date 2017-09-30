var pdf = require('pdfkit');
var fs = require('fs');


function make_pdf(input, file, format) {
    var myDoc = new pdf({
        size: 'legal',
        margins: {top:10,bottom:10,left:10,right:10},
        layout: format
    });
    myDoc.pipe(fs.createWriteStream(file));

    myDoc.font('Courier', 16)
         .text(input);

    myDoc.end();
}

module.exports.make_pdf = make_pdf;