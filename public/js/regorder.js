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

            var scriptString = "$('#"+idstring+"').autocomplete({ source: function(req,res) {  $.ajax({   url: 'http://localhost:8080/customers/search?key='+req.term,dataType: 'json',type: 'GET',"+
                    "data: {  term: req.term }, success: function(data) { res($.map(data, function(item) { return { label: item,  value: item };}));},error: function(xhr){alert(xhr.status + ' : ' + xhr.statusText);}"+
                "}); },  select: function(event, ui) {  } });";

            script[(script.innerText===undefined?"textContent":"innerText")] = scriptString;
            newcell.innerHTML = "<input type='text' name='typeahead' id='"+idstring+"' class='typeahead tt-query' autocomplete='off' spellcheck='false' placeholder='Item Number'>";
            newcell.appendChild(script);
        }
        else if(i==2){
            newcell.innerHTML = "<input type = 'text' id='"+idstring+"' placeholder='Qty'>";
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
function autofill(i){

}

