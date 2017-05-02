function remove(i){
    try {
        var confirm = window.confirm("Are you sure you want to remove this item?");
        var table = document.getElementById("body");

        if(confirm == true) {
            if (table.rows.length > 1) {
                $.ajax({
                    data: { itemno: document.getElementById('item'+i).value},
                    dataType: 'json',
                    type: 'POST',
                    url: '/customers/removeFromCart',
                    success: function() {
                        alert("Item was removed");
                        location.reload();
                    }
                    ,error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);
                    }
                });
                table.deleteRow(i);
            }
        }
    }catch(e) {
        alert(e);
    }
}

function autofill(){
    for(var i = 1; i < document.getElementById('body').rows.length; i++) {
        $.ajax({
            data: {itemno: document.getElementById('item' + i).value, current_cell: i},
            dataType: 'json',
            type: 'GET',
            url: '/customers/getItem',
            success: function (data) {
                $.each(data, function (index, element) {
                    if(element.uom == null || element.uom == 'EA') element.uom = 'EA';
                    if(document.getElementById('uom'+element.current_cell).value == 'null')document.getElementById('uom'+element.current_cell).value = element.uom;
                    document.getElementById('item_desc'+element.current_cell).value = element.item_desc + element.item_desc_2;
                });
            }
            , error: function (xhr) {
                alert(xhr.status + ' : ' + xhr.statusText);
            }
        });
        $.ajax({
            data: {itemno: document.getElementById('item' + i).value, uom: document.getElementById('uom'+i).value, current_cell: i},
            dataType: 'json',
            type: 'GET',
            url: '/customers/getConversion',
            success: function (data) {
                $.each(data, function (index, element) {
                    document.getElementById('convert'+element.current_cell).value = element.convert;
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
                    if(element.baseprice != 0)
                        document.getElementById('unit'+element.current_cell).value = roundToFour(element.baseprice*document.getElementById('convert'+element.current_cell).value);
                    if(element.totalprice != 0)
                        document.getElementById('subtotal'+element.current_cell).value = roundToTwo(element.totalprice*document.getElementById('convert'+element.current_cell).value);
                });
            }
            , error: function (xhr) {
                alert(xhr.status + ' : ' + xhr.statusText);
            }
        });

    }
}
function roundToTwo(num) {
    return (+(Math.round(num + "e+2")  + "e-2")).toFixed(2);
}
function roundToFour(num) {
    return +(Math.round(num + "e+4")  + "e-4");
}