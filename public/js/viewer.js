function autofill(){
    for(var i = 1; i < document.getElementById('cart').rows.length; i++) {
        $.ajax({
            data: {itemno: document.getElementById('item' + i).value, current_cell: i},
            dataType: 'json',
            type: 'GET',
            url: '/customers/getItem',
            success: function (data) {
                $.each(data, function (index, element) {
                    if(element.uom == null) element.uom = 'EA';
                    document.getElementById('uom'+element.current_cell).value = element.uom;
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
                        document.getElementById('subtotal'+element.current_cell).value = element.totalprice;
                    });
                }
                , error: function (xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            });

    }
}