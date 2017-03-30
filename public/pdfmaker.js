var pdf = require('pdfkit');
var fs = require('fs');


function make_pdf(input, file) {
    var myDoc = new pdf({
        size: 'LEGAL'
    });
    myDoc.pipe(fs.createWriteStream(file));

    myDoc.font('Times-Roman', 16)
         .text(input, {
             width: 412,
             align: 'justify',
             columns: 1
         });

    myDoc.end();
}

module.exports.make_pdf = make_pdf;