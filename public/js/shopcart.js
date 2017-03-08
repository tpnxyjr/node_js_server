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