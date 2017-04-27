function autofill(){
    for(var i = 1; i < document.getElementById('cart').rows.length; i++) {
        $.ajax({
            data: {itemno: document.getElementById('item' + i).value, current_cell: i},
            dataType: 'json',
            type: 'GET',
            url: '/customers/getItem',
            success: function (data) {
                $.each(data, function (index, element) {
                    if(element.uom == null || element.uom == 'EA') element.uom = 'EA';
                    document.getElementById('uom'+element.current_cell).value = element.uom;
                    if(element.item_desc == 'Custom')
                        document.getElementById('item_desc'+element.current_cell).value = reverse_convert(document.getElementById('item' + element.current_cell).value);
                    else
                        document.getElementById('item_desc'+element.current_cell).value = element.item_desc + element.item_desc_2;
                });
            }
            , error: function (xhr) {
                alert(xhr.status + ' : ' + xhr.statusText);
            }
        });
            $.ajax({
                data: {itemno: document.getElementById('item' + i).value, qty: document.getElementById('qty'+i).value, current_cell: i},
                dataType: 'json',
                type: 'GET',
                url: '/customers/getPrice',
                success: function (data) {
                    $.each(data, function (index, element) {
                        if(element.totalprice != 0) {
                            document.getElementById('unit' + element.current_cell).value = element.baseprice;
                            document.getElementById('subtotal' + element.current_cell).value = element.totalprice;
                        }
                    });
                }
                , error: function (xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            });


        //if item desc = contract, function convert

    }
}

var numberconvert={};
numberconvert['622'] = '2\" FAUXWOOD SMOOTH';
numberconvert['622'] = '2\" FAUXWOOD EMBOSSED';
numberconvert['660'] = '4P VERTICAL WAND';
numberconvert['610'] = '1\" ALUMINUM';
numberconvert['663'] = '8P VERTICAL';
numberconvert['662'] = '4P VERTICAL CORD & CHAIN';
numberconvert['632'] = '2\" FAUXWOOD';
numberconvert['628'] = '2.5\" FAUXWOOD';
numberconvert['690'] = 'ROLLERSHADE';
numberconvert['640'] = '2\" WOOD BLIND';
numberconvert['900'] = 'SMOOTH';
numberconvert['902'] = 'EMBOSS';
numberconvert['904'] = 'SANDBLAST';
numberconvert['121'] = 'CONTRACT 22G';
numberconvert['122'] = 'PREMIUM 27G';
numberconvert['123'] = 'RIB';
numberconvert['124'] = 'FLAT';
numberconvert['125'] = 'PERFORATE';
numberconvert['126'] = 'EMBOSS';
numberconvert['127'] = 'PRINT';
numberconvert['140'] = 'DESIGNER - THIN BARK';
numberconvert['141'] = 'DESIGNER - AQUA STREAK';
numberconvert['142'] = 'DESIGNER - AQUA FLOW';
numberconvert['143'] = 'DESIGNER - WIND FLOW';
numberconvert['144'] = 'DESIGNER - TWIST BARK';
numberconvert['145'] = 'DESIGNER - FLOWER CREST';
numberconvert['202'] = 'SMOOTH';
numberconvert['910'] = 'SMOOTH';
numberconvert['101'] = 'WHITE';
numberconvert['301'] = 'SNOW';
numberconvert['605'] = 'PEARL';
//numberconvert['610'] = 'OYSTER';
numberconvert['613'] = 'OFF-WHITE';
numberconvert['615'] = 'BIRCH';
numberconvert['620'] = 'NATURAL';
numberconvert['621'] = 'RIGHT WHITE';
numberconvert['926'] = 'ALABASTER';
numberconvert['205'] = 'WHITE';
numberconvert['112'] = 'OFF-WHITE';
numberconvert['040'] = 'IVORY';
numberconvert['E101']= 'E101-WHITE';
numberconvert['E301']= 'E301-SNOW';
numberconvert['E605']= 'E605-PEARL';
numberconvert['E610']= 'E610-OYSTER';
numberconvert['E613']= 'E613-OFF-WHITE';
numberconvert['E615']= 'E615-BIRCH';
numberconvert['E620']= 'E620-NATURAL';
numberconvert['E621']= 'E621-RIGHT WHITE';
numberconvert['E926']= 'E926-ALABASTER';
numberconvert['618']= 'CHERRY';

function reverse_convert(text){
    var prod = text.substring(0,3);
    var prof = text.substring(4,7);
    var color = text.substring(8,11);
    return numberconvert[prod]+' '+numberconvert[prof]+' '+numberconvert[color];
}