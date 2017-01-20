window.addEventListener("beforeunload", leavealert);
function leavealert(e) {
    var confirmationMessage = "\o/";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
}

function compare(i){
    var a = "CheckValue"+i;
    var b = "imagea"+i;
    var c = "CheckValue2"+i;
    if(parseInt(document.getElementById(a).value)== parseInt(document.getElementById(c).value)) document.getElementById(b).style.display='block';
    else document.getElementById(b).style.display='none';
    b = "imagec"+i;
    if(parseInt(document.getElementById(a).value)!= parseInt(document.getElementById(c).value) && parseInt(document.getElementById(a).value)!=0) document.getElementById(b).style.display='block';
    else document.getElementById(b).style.display='none';
    b = "imageb"+i;
    if(parseInt(document.getElementById(a).value)== 0) document.getElementById(b).style.display='block';
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
            document.getElementById(temp).value = 0;
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
            newcell.innerHTML = "<select id = \"" + idstring + "\" name=\"" + idstring + "\"><option>BOX</option><option>PALLET</option><option>BUNDLE</option></select>";

        }
        else if(i == 4){
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\" onchange='total(\"" + tableID + "\")'>";
        }
        else {
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\">";
        }

    }
    document.getElementById("totalrows").value++;
}
function addRows(tableID, pack, amount){
    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;
    for(var i=0; i<colCount; i++) {

        var newcell = row.insertCell(i);
        var idstring = "inside"+rowCount+"at"+i;
        var val = "";

        if(i == 0){
            newcell.innerHTML = "<select id = \"" + idstring + "\" name=\"" + idstring + "\" ><option>BOX</option><option>PALLET</option><option>BUNDLE</option></select> " +
                "<input type = 'text' id = \"" + idstring + "a\" name=\"" + idstring + "a\" value='"+escapeHtml(pack+" x"+amount)+"'>";

        }
        else if(i == 4){
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\" onchange='total(\"" + tableID + "\")'>";
        }
        else {
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\">";
        }

    }
    document.getElementById("totalrows").value++;
}

function deleteRow(tableID){
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;

        if (rowCount > 1){
            table.deleteRow(rowCount-1);
            rowCount--;
            document.getElementById("totalrows").value--;
        }
    }catch(e) {
        alert(e);
    }
}

function total(tableID){
    var table = document.getElementById(tableID);
    var totalweight = 0;

    var rowCount = table.rows.length;
    for(var i = 1; i < rowCount; i++){
        if(isNaN(document.getElementById("inside"+i+"at4").value) || document.getElementById("inside"+i+"at4").value == "") var temp = 0;
        else var temp = document.getElementById("inside"+i+"at4").value;
        totalweight+= parseInt(temp);
    }


    document.getElementById('totalweight').value = totalweight;
}

function addcomment(rowID){
    var user = document.getElementById(user);
    alert(user);
}

function checkiffinished(){
    var rowCount = document.getElementById("tl").value;
    if(document.getElementById('complete').value == true) {
        for (var i = 0; i < rowCount - 1; i++) {
            if (document.getElementById("CheckField2" + i).value == document.getElementById("converted" + i).innerHTML)
                document.getElementById("CheckValue" + i).value *= document.getElementById("multiplier" + i).value;
        }
    }
    return true;
}

function countItems(){
    var packaging = [];
    var rows = document.getElementById('tl').value;
    for(var i = 0; i < rows; i++){
        var temp = document.getElementById('pickfield'+i).value.split(',');
        for(var j = 0; j < temp.length; j++)
            packaging.push(temp[j].trim());
    }
    for (var stats = {}, j, i = packaging.length; i--;) {
        if (!((j=packaging[i]) in stats))
            stats[j]=0;
        stats[j]++;
    }
    for (var key in stats)
    {
        addRows('dimension', key, stats[key]);
    }
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
window.onload=function() {
    var event = new Event('change');
    var rowCount = document.getElementById('tl').value;
    for(var i =  0; i < rowCount; i++) {
        document.getElementById("CheckValue"+i).dispatchEvent(event);
    }
    document.getElementById("lower").style.marginTop = document.getElementById("upper").offsetHeight+"px";
}