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
            data: {itemno: document.getElementById('item' + i).value, qty: document.getElementById('qty'+i).value, current_cell: i},
            dataType: 'json',
            type: 'GET',
            url: '/customers/getPrice',
            success: function (data) {
                $.each(data, function (index, element) {
                    if(element.totalprice != 0)
                        document.getElementById('subtotal'+element.current_cell).value = element.totalprice;
                });
            }
            , error: function (xhr) {
                alert(xhr.status + ' : ' + xhr.statusText);
            }
        });

    }
}