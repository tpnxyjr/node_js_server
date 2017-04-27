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
            newcell.innerHTML = "<input type='text' name='"+idstring+"' id='"+idstring+"' class='typeahead tt-query' autocomplete='off' spellcheck='false' placeholder='Item Number' onchange='autofill("+rowCount+","+colCount+")'>";
            newcell.appendChild(script);
        }
        else if(i==2){
            //pickable uom
            newcell.innerHTML = "<select name='uom"+rowCount+"' id='uom"+rowCount+"'></select>";
        }
        else if(i==3){
            newcell.innerHTML = "<input type = 'text' name='"+idstring+"' id='"+idstring+"' placeholder='Qty' onchange='autofill("+rowCount+","+colCount+")'>";
        }
        else if(i == 7 || i == 8){
            newcell.innerHTML = "$<input type = 'text' id='"+idstring+"' style='border:none' readonly>";
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
            newcell.innerHTML = "<input type = 'number' id='"+idstring+"' placeholder='Qty' onchange='autofill("+rowCount+","+colCount+")'>";
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
                       // document.getElementById(idstring+2).value = element.uom;
                        document.getElementById(idstring+5).value = element.item_desc;
                        document.getElementById(idstring+6).value = element.item_desc_2;
                    });
                }
                ,error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);
                     }
            });
        });
    if(document.getElementById(idstring+3).value < 0) document.getElementById(idstring+3).value = 0;
        if(document.getElementById(idstring+3).value!='' && !isNaN(document.getElementById(idstring+3).value)){
            $.ajax({
                data: { itemno: item, qty: document.getElementById(idstring+3).value },
                dataType: 'json',
                type: 'GET',
                url: '/customers/getPrice',
                success: function(data) {
                    $.each(data, function(index, element) {
                        document.getElementById(idstring+7).value = element.baseprice;
                        document.getElementById(idstring+8).value = element.totalprice;
                    });
                }
                ,error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);
                     }
            });
        }
        updateUom('uom'+rowCount,item);
}
function subtotal(tableID){
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    var total = 0;
    for(var i = 1; i < rowCount; i++){
        total+= parseFloat(document.getElementById("inside"+i+"at"+8).value);
    }
    document.getElementById("total").value = total.toFixed(2);
    document.getElementById('rowlength').value = rowCount;
}
$(document).ready(function() {
    $('#loadmsg').hide();
});

function checkOrder(){
    var rowCount = document.getElementById('body').rows.length;
    for(var i = 1; i < rowCount; i++)
    {
        if(document.getElementById("inside"+i+"at1").value == null){
            alert("ITEM NUMBER EMPTY. Please fill in or remove empty rows");
            return false;
        }
        if(document.getElementById("inside"+i+"at2").value == null){
            alert("QUANTITY EMPTY. Please fill in or remove empty rows");
            return false;
        }
    }
    document.getElementById('rowlength').value = rowCount;
    alert(rowCount);
    return true;
}

function updateUom(cellID, itemno){
    var operator = document.getElementById(cellID);
    for(var i = operator.options.length -1; i >= 0; i--){
        operator.remove(i);
    }
    $.ajax({
        data: {itemno: itemno},
        dataType: 'json',
        type: 'GET',
        url: '/customers/getUom',
        success: function (data) {
            $.each(data, function (index, element) {
                var option = document.createElement('option');
                option.text = element.uom_1;
                operator.add(option);
                var option2 = document.createElement('option');
                option2.text = element.uom_2;
                operator.add(option2);
            });
        }
        , error: function (xhr) {
            alert(xhr.status + ' : ' + xhr.statusText);
        }
    });

}