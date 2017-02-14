window.addEventListener("beforeunload", leavealert);
function leavealert(e) {
    var confirmationMessage = "\o/";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
}

function compare(i){
    var a = "CheckValue"+i;
    var b = "imagea"+i;
    var c = "CheckValueB"+i;
    var d = "CheckFieldB"+i;
    if(parseFloat(document.getElementById(a).value)== parseFloat(document.getElementById(c).options[indexMatchingText(document.getElementById(c), document.getElementById(d).value.trim())].value)) document.getElementById(b).style.display='block';
    else document.getElementById(b).style.display='none';
    b = "imagec"+i;
    if(parseFloat(document.getElementById(a).value)!= parseFloat(document.getElementById(c).options[indexMatchingText(document.getElementById(c), document.getElementById(d).value.trim())].value) && parseFloat(document.getElementById(a).value)!=0) document.getElementById(b).style.display='block';
    else document.getElementById(b).style.display='none';
    b = "imageb"+i;
    if(parseFloat(document.getElementById(a).value)== 0) document.getElementById(b).style.display='block';
    else document.getElementById(b).style.display='none';
}
function indexMatchingText(ele, text) {
    for (var i=0; i<ele.length;i++) {
        if (ele[i].childNodes[0] != null && ele[i].childNodes[0].nodeValue == text){
            return i;
        }
    }
    return 1;
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
        if(document.getElementById(temp).value == "" || document.getElementById(temp).value == "null"){
            document.getElementById(temp).value = 0;
        }
    }
    window.removeEventListener('beforeunload', leavealert);
    return true;
}
function checkFilled(FieldID) {
    var inputVal = document.getElementById(FieldID);
    if (inputVal.value == "") {
        inputVal.style.backgroundColor = "yellow";
    }
    else{
        inputVal.style.backgroundColor = "";
    }
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
        else if(i == 5){
            newcell.innerHTML = "<input type='checkbox' id = 'shippingrow"+rowCount+"'>";
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
            newcell.innerHTML = "<input type='text' id = \"" + idstring + "\" name=\"" + idstring + "\" value='' hidden>" +
                "<input type = 'text' id = \"" + idstring + "a\" name=\"" + idstring + "a\" value='"+escapeHtml(pack+" x"+amount)+"'>";

        }
        else if(i == 4){
            if (rowCount > 1) val = document.getElementById("inside" + (rowCount - 1) + "at" + i).value;
            newcell.innerHTML = "<input id=\"" + idstring + "\" name=\"" + idstring + "\" size=\"5\" type=\"text\" value=\"" + escapeHtml(val) + "\" onchange='total(\"" + tableID + "\")'>";
        }
        else if(i == 5){
            var newcell = row.insertCell(i);
            newcell.innerHTML = "<input type='checkbox' id = 'shippingrow"+rowCount+"'>";
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
        var i = 1, deleted = 0;
        while( i < rowCount-1){
            if(document.getElementById('shippingrow'+i).checked == true) {
                deleted = 1;
                table.deleteRow(i);
                for(var j = i+1; j < rowCount; j++){
                    document.getElementById('inside'+j+'at'+0).name = 'inside'+(j-1)+'at'+0;
                    document.getElementById('inside'+j+'at'+0).id = 'inside'+(j-1)+'at'+0;
                    document.getElementById('inside'+j+'at'+1).name = 'inside'+(j-1)+'at'+1;
                    document.getElementById('inside'+j+'at'+1).id = 'inside'+(j-1)+'at'+1;
                    document.getElementById('inside'+j+'at'+2).name = 'inside'+(j-1)+'at'+2;
                    document.getElementById('inside'+j+'at'+2).id = 'inside'+(j-1)+'at'+2;
                    document.getElementById('inside'+j+'at'+3).name = 'inside'+(j-1)+'at'+3;
                    document.getElementById('inside'+j+'at'+3).id = 'inside'+(j-1)+'at'+3;
                    document.getElementById('inside'+j+'at'+4).name = 'inside'+(j-1)+'at'+4;
                    document.getElementById('inside'+j+'at'+4).id = 'inside'+(j-1)+'at'+4;
                    document.getElementById('shippingrow'+j).id = 'shippingrow'+(j-1);
                }
                rowCount-=1;
                document.getElementById("totalrows").value--;
                i--;
            }
            i++;
        }
        if(deleted == 0){
            if (rowCount > 1){
                table.deleteRow(rowCount-1);
                rowCount--;
                document.getElementById("totalrows").value--;
            }
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
        totalweight+= parseFloat(temp);
    }


    document.getElementById('totalweight').value = totalweight;
}

function addcomment(rowID){
    var user = document.getElementById(user);
    alert(user);
}

function checkiffinished() {
    var rowCount = document.getElementById("tl").value;
    if (document.getElementById('complete').value == "true") {
        for (var i = 0; i < rowCount; i++) {
            if(isNaN(document.getElementById("CheckValue" + i).value))document.getElementById("CheckValue" + i).value = 0;
            if (document.getElementById("CheckFieldB" + i).value.trim() == document.getElementById("converted" + i).innerText.trim())
                document.getElementById("CheckValue" + i).value = parseFloat(document.getElementById("CheckValue" + i).value) * parseFloat(document.getElementById("multiplier" + i).value);
            document.getElementById("CheckFieldB" + i).value = document.getElementById("convertedB" + i).innerHTML;
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
            packaging.push(document.getElementById('packfield'+i).value + " " + temp[j].trim());
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
    /* var str = "|User=0101|Name=ImNewUser|IsAdmin=0|RefId=23ae2123cd223bf235|";


     var result = {};
     str.split('|').forEach(function(x){
     var arr = x.split('=');
     arr[1] && (result[arr[0]] = arr[1]);
     });
     */
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
    var rowCount = document.getElementById('body').rows.length;
    for(var i =  0; i < rowCount; i++) {
        if(document.getElementById("CheckValue"+i)!=null)document.getElementById("CheckValue"+i).dispatchEvent(event);
    }
    document.getElementById("lower").style.marginTop = document.getElementById("upper").offsetHeight+"px";
}
