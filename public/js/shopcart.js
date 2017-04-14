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
    for(var i = 1; i < document.getElementById('cart').rows.length; i++) {
        var item = document.getElementById('item' + i).value;
        jQuery(function ($) {
            $.ajax({
                data: {itemno: item},
                dataType: 'json',
                type: 'GET',
                url: '/customers/getItem',
                success: function (data) {
                    $.each(data, function (index, element) {
                        document.getElementById('uom'+i).value = element.uom;
                    });
                }
                , error: function (xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            });
        });
        if (document.getElementById('qty' + i).value < 0) document.getElementById('qty' + i).value = 0;
        if (document.getElementById('qty' + i).value != '' && !isNaN(document.getElementById('qty' + i).value)) {
            $.ajax({
                data: {itemno: item, qty: document.getElementById('qty'+i).value},
                dataType: 'json',
                type: 'GET',
                url: '/customers/getPrice',
                success: function (data) {
                    $.each(data, function (index, element) {
                        document.getElementById('subtotal' + i).value = element.totalprice;
                    });
                }
                , error: function (xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            });
        }
    }
}