function addRow(tableID) {

    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;
    for (var i = 0; i < colCount; i++) {
        var newcell	= row.insertCell(i);
        var idstring = "inside"+rowCount+"at"+i;

        if(i==0){
        }
        else if(i==1){
            var script = document.createElement('script');
            script.type = "text/javascript";

            var scriptString = "$('#"+idstring+"').autocomplete({ source: function(req,res) {  $.ajax({   url: '/customers/search?key='+req.term,dataType: 'json',type: 'GET',"+
                "data: {  term: req.term }, success: function(data) { res($.map(data, function(item) { return { label: item,  value: item };}));},error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);}"+
                "}); },  select: function(event, ui) {  } });";

            script[(script.innerText===undefined?"textContent":"innerText")] = scriptString;
            newcell.innerHTML = "<input type='text' name='typeahead' id='"+idstring+"' class='typeahead tt-query' autocomplete='off' spellcheck='false' placeholder='Item Number' onchange='autofill("+rowCount+","+colCount+")'>";
            newcell.appendChild(script);
        }
        else if(i==2){
            newcell.innerHTML = "<input type = 'text' id='"+idstring+"' placeholder='Qty' onchange='autofill("+rowCount+","+colCount+")'>";
        }
        else{
            newcell.innerHTML = "<input type = 'text' id='"+idstring+"' readonly>";
        }
    }
}
function addDuplicate(tableID) {

    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;
    for (var i = 0; i < colCount; i++) {
        var newcell	= row.insertCell(i);
        var idstring = "inside"+rowCount+"at"+i;

        var val = "";
        if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;
        if(i==0){
        }
        else if(i==1){
            var script = document.createElement('script');
            script.type = "text/javascript";

            var scriptString = "$('#"+idstring+"').autocomplete({ source: function(req,res) {  $.ajax({   url: '/customers/search?key='+req.term,dataType: 'json',type: 'GET',"+
                "data: {  term: req.term }, success: function(data) { res($.map(data, function(item) { return { label: item,  value: item };}));},error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);}"+
                "}); },  select: function(event, ui) {  });";

            script[(script.innerText===undefined?"textContent":"innerText")] = scriptString;
            newcell.innerHTML = "<input type='text' name='typeahead' id='"+idstring+"' class='typeahead tt-query' autocomplete='off' spellcheck='false' value=\""+escapeHtml(val)+"\" placeholder='Item Number'>";
            newcell.appendChild(script);
        }
        else if(i==2){
            newcell.innerHTML = "<input type = 'text' id='"+idstring+"' placeholder='Qty' onchange='autofill("+rowCount+","+colCount+")'>";
        }
        else{
            newcell.innerHTML = "<input type = 'text' id='"+idstring+"' readonly>";
        }
    }
}
function deleteRow(tableID) {
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;

        if (rowCount > 1){
            table.deleteRow(rowCount-1);
            rowCount--;
        }
    }catch(e) {
        alert(e);
    }
}
function autofill(rowCount,colCount){
        var idstring = "inside" + rowCount + "at";
        var item = document.getElementById(idstring+1).value;
        jQuery(function($) {
            $.ajax({
                data: { itemno: item},
                dataType: 'json',
                type: 'GET',
                url: '/customers/getItem',
                success: function(data) {
                    $.each(data, function(index, element) {
                        document.getElementById(idstring+3).value = element.uom;
                        document.getElementById(idstring+5).value = element.item_desc;
                    });
                }
                ,error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);
                     }
            });
        });
        if(document.getElementById(idstring+2).value!='' && !isNaN(document.getElementById(idstring+2).value)){
            $.ajax({
                data: { itemno: item, qty: document.getElementById(idstring+2).value },
                dataType: 'json',
                type: 'GET',
                url: '/customers/getPrice',
                success: function(data) {
                    $.each(data, function(index, element) {
                        document.getElementById(idstring+6).value = element.baseprice;
                        document.getElementById(idstring+7).value = element.totalprice;
                    });
                }
                ,error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);
                     }
            });
        }
}
function subtotal(tableID){
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    var total = 0;
    for(var i = 1; i < rowCount; i++){
        total+= parseInt(document.getElementById("inside"+i+"at"+7).value);
    }
    document.getElementById("total").value = total;
}
$(document).ready(function() {
    $('#loadmsg').hide();
});