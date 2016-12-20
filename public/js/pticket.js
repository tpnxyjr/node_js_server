window.addEventListener("beforeunload", leavealert);
function leavealert(e) {
    var confirmationMessage = "\o/";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
}

function compare(i,j){
    var a = "CheckValue"+i;
    var b = "image"+i;
    if(parseInt(document.getElementById(a).value)== j) document.getElementById(b).style.display='block';
    else document.getElementById(b).style.display='none';
}

function show(element){
    //var info = "info"+element;
    var desc = "desc"+element;
    //if(document.getElementById(info).style.display == 'none') document.getElementById(info).style.display = 'block';
    //else document.getElementById(info).style.display = 'none';
    if(document.getElementById(desc).style.display=='none')document.getElementById(desc).style.display = 'table-row';
    else document.getElementById(desc).style.display = 'none';
    // if(document.getElementById("desctitle").style.display=='none')document.getElementById("desctitle").style.display = 'block';
}

function checkForm(){
    var total = document.getElementById('tl').value;
    for(var i = 0; i < total; i++){
        var temp = 'CheckValue'+i;
        if(isNaN(document.getElementById(temp).value)){
            alert('line '+ (i+1) +' is not a number');
            return false;
        }
        if(document.getElementById(temp).value == ""){
            alert('line '+ (i+1) +' is empty');
            return false;
        }
    }
    window.removeEventListener('beforeunload', leavealert);
    return true;
}

function showComment(element){
    var comment = 'comment'+element;
    if(document.getElementById(comment).style.display == 'none') document.getElementById(comment).style.display = 'table-row';
    else document.getElementById(comment).style.display = 'none';
}

function addRow(tableID){
    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;
    for(var i=0; i<colCount; i++) {

        var newcell = row.insertCell(i);
        var idstring = "inside"+rowCount+"at"+i;
        var val = "";

        if(i == 0){
            newcell.innerHTML = "<select id = \"" + idstring + "\"><option>BOX</option><option>PALLET</option><option>BUNDLE</option></select>";
        }
        else if(i == 4){
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\" onchange='total(\"" + table + "\")'>";
        }
        else {
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\">";
        }

    }
}

function deleteRow(tableID){
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

function total(tableID){
    var table = document.getElementById(tableID);
    var totalweight = 0;

    var rowCount = table.rows.length;
    for(var i = 0; i < rowCount; i++){
        var temp = document.getElementById("inside"+i+"at4").value;
        totalweight+= temp;
    }


    document.getElementById('totalweight').value = totalweight;
}

function addcomment(rowID){
    var user = document.getElementById(user);
    alert(user);
}

function checkiffinished(tableID){
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    document.getElementById('complete').value = true;

    //for each row check if full
    for(var i =  0; i < rowCount; i++) {
        var b = "image"+i;
        if (document.getElementById(b).style.display == 'none')document.getElementById('complete').value = false;
    }
    return true;
}
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
$(document).ready(function()
    {
        $("#body").tablesorter();
    }
);