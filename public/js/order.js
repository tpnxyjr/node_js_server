/**
 * Created by Kevin on 8/25/2016.
 */
$(document).ready(function () {
    $(window).on('beforeunload', function(){
        return "Any changes will be lost";
    });

    $(document).on("submit", "form", function (event) {
        $(window).off('beforeunload');
    });
});

function addRow(tableID) {

    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;
    for(var i=0; i<colCount; i++) {

        var newcell	= row.insertCell(i);
        var idstring = "inside"+rowCount+"at"+i;
        if(i!=0 && i!=1 && i!=2 && i!=3 && i!=6 && i!=8 && i!=9 && i!=12 && i!=colCount-1){
            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;
            newcell.innerHTML = "<input id=\""+idstring+"\" name=\""+idstring+"\" size=\"5\" type=\"text\" value=\""+escapeHtml(val)+"\">";
            if(i == 13 || i == 14){
                newcell.innerHTML = newcell.innerHTML + "<div id=\"dropdown\"><select onchange='document.getElementById(\""+idstring+"\").value = this.value'><option></option><option>YES</optionoption><option>NO</option></select></div>";
            }
        }
        else if(i == 1){
            var script = document.createElement('script');
            script.type = "text/javascript";
            var scriptString = "jQuery(document).ready(function(){"+
            "$(document).on('click', '#"+idstring+"', function() {"+
            "    $(this).autocomplete({  source: prodTags  }); }); });";
            script[(script.innerText===undefined?"textContent":"innerText")] = scriptString;

            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;

            newcell.innerHTML = "<input id=\""+idstring+"\" type=\"text\" class=\"autofill\" value=\""+escapeHtml(val)+"\">" +
            "<div id=\"dropdown\"><select name=\""+idstring+"\" id=\"prodlist"+rowCount+"\" onchange='document.getElementById(\""+idstring+"\").value = this.value'><option value=''></option></option></select></div>";
            newcell.appendChild(script);

            var selectBox = document.getElementById("prodlist"+rowCount);
            for(var j = 0, l = prodTags.length; j < l; j++){
                var option = document.createElement("option");
                option.text = prodTags[j];
                selectBox.add( option );
            }
        }
        else if(i == 2){
            var script = document.createElement('script');
            script.type = "text/javascript";
            var scriptString = "jQuery(document).ready(function(){"+
                "$(document).on('click', '#"+idstring+"', function() {"+
                "    $(this).autocomplete({  source: profTags  }); }); });";
            script[(script.innerText===undefined?"textContent":"innerText")] = scriptString;

            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;

            newcell.innerHTML = "<input id=\""+idstring+"\" type=\"text\" class=\"autofill\" value=\""+escapeHtml(val)+"\">"+
                "<div id=\"dropdown\"><select name=\""+idstring+"\" id=\"proflist"+rowCount+"\" onchange='document.getElementById(\""+idstring+"\").value = this.value'><option value=''></option></option></select></div>";
            newcell.appendChild(script);

            var selectBox = document.getElementById("proflist"+rowCount);
            for(var j = 0, l = profTags.length; j < l; j++){
                var option = document.createElement("option");
                option.text = profTags[j];
                selectBox.add( option );
            }
        }
        else if(i == 3){
            var script = document.createElement('script');
            script.type = "text/javascript";
            var scriptString = "jQuery(document).ready(function(){"+
                "$(document).on('click', '#"+idstring+"', function() {"+
                "    $(this).autocomplete({  source: colorTags  }); }); });";
            script[(script.innerText===undefined?"textContent":"innerText")] = scriptString;

            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;

            newcell.innerHTML = "<input id=\""+idstring+"\" type=\"text\" class=\"autofill\" value=\""+escapeHtml(val)+"\">"+
                "<div id=\"dropdown\"><select name=\""+idstring+"\" id=\"colorlist"+rowCount+"\" onchange='document.getElementById(\""+idstring+"\").value = this.value'><option value=''></option></option></select></div>";
            newcell.appendChild(script);

            var selectBox = document.getElementById("colorlist"+rowCount);
            for(var j = 0, l = colorTags.length; j < l; j++){
                var option = document.createElement("option");
                option.text = colorTags[j];
                selectBox.add( option );
            }
        }
        else if(i == 6){
            newcell.innerHTML = "<p align='center'><b>X</b></p>"
        }
        else if(i == 8){
            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;

            newcell.innerHTML = "<input id=\""+idstring+"\" name=\""+idstring+"\" type=\"text\" value=\""+escapeHtml(val)+"\">" +
                "<div><select id=\""+idstring+"\" onchange='document.getElementById(\""+idstring+"\").value = this.value'><option></option><option value='EX'>EX</option>" +
                "<option value='IB'>IB</option><option value='OB'>OB</option></select></div>";
        }
        else if(i == 9){
            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;

            newcell.innerHTML = "<input id=\""+idstring+"\" name=\""+idstring+"\" type=\"text\" value=\""+escapeHtml(val)+"\">" +
                "<div><select id=\""+idstring+"\"onchange='document.getElementById(\""+idstring+"\").value = this.value'><option></option><option value='3V'>3V</option>" +
                "<option value='2V'>2V</option><option value='3F'>3F</option><option value='L'>L</option>" +
                "<option value='CP'>CP</option></select></div>";
        }
        else if(i == 12){
            var val = "";
            if(rowCount > 1) val = document.getElementById("inside" + (rowCount-1) + "at" + i).value;

            newcell.innerHTML = "<input id=\""+idstring+"\" name=\""+idstring+"\" type=\"text\" value=\""+escapeHtml(val)+"\">" +
                "<div><select id=\""+idstring+"\"onchange='document.getElementById(\""+idstring+"\").value = this.value'><option></option><option value='C'>C</option><option value='W'>W</option></select></div>";
        }
        else if(i == colCount-1) {
            newcell.innerHTML = "<div><span>DS <input id=\""+idstring+"1\" name=\""+idstring+"1\" type='text' style=\"font-size: 10pt; border: none; border-color: transparent;\"placeholder=\"Description\" size=\"55\"></span>" +
                "<br><span>CM <input id=\""+idstring+"2\" name=\""+idstring+"2\" type='text' style=\"font-size: 10pt; border: none; border-color: transparent;\"placeholder=\"Comment\" size=\"55\"></span>" +
                "<br><span>UNIT$ <input id=\""+idstring+"3\" name=\""+idstring+"3\" type='text' style=\"font-size: 10pt; border: none; border-color: transparent;\"placeholder=\"0\"size=\"21\"></span>" +
                "<span>SUB$ <input id=\""+idstring+"4\" name=\""+idstring+"4\" class='subtotal' type='text' style=\"font-size: 10pt; border: none; border-color: transparent;\"placeholder=\"0\"size=\"21\"></span><div>";
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

function subtotal(tableID){
    checkInputs(tableID);
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    document.getElementById('rowlength').value = rowCount;
    var colCount = table.rows[0].cells.length - 1;
    var total = 0, debug = 0;
    var vertical = false;
    for(var i = 1; i < rowCount; i++) {
        if (document.getElementById("inside" + i + "at1").value.indexOf("VERTICAL") != -1) {
            vertical = true;
            var prof = profhash["V" + document.getElementById("inside"+i+"at2").value];
            var base = prodhash[document.getElementById("inside"+i+"at1").value];
        }
        else
            var prof = profhash["H"+document.getElementById("inside"+i+"at2").value];

        if(document.getElementById("inside"+i+"at3").value.indexOf("DESIGNER")!=-1)
            var color = colorhash['DESIGNER'];
        else {
            if (vertical && document.getElementById("inside" + i + "at3").value != 'LIGHT GRAY'){
                var color = 1;
            }
            else var color = colorhash[document.getElementById("inside" + i + "at3").value];
        }
        var multiplier = prodhash[document.getElementById("inside"+i+"at1").value]*
        prof*color || 0;

        if(debug)console.log(multiplier+','+prodhash[document.getElementById("inside"+i+"at1").value]+','+prof+','+color);
        document.getElementById("inside"+i+"at"+colCount+"1").value = document.getElementById("inside"+i+"at1").value+" "+document.getElementById("inside"+i+"at2").value+" "+document.getElementById("inside"+i+"at3").value;
        //document.getElementById("inside"+i+"at"+colCount+"2").value = multiplier;
        //document.getElementById("inside"+i+"at"+colCount+"3").value = multiplier * document.getElementById("inside"+i+"at4").value || 0;

        var discount=0;
        var custdiscountfactor = 0;
        if(document.getElementById("RATING").value.substring(0,2).valueOf() == "RC".valueOf())
            custdiscountfactor = ratinghash[document.getElementById("RATING").value];
        else
            custdiscountfactor = parseFloat(document.getElementById("RATING").value) || 0;
        if(document.getElementById("inside"+i+"at"+colCount+"1").value.indexOf("VERTICAL") == -1){
            if(document.getElementById("OVERRIDE").value == "N")discount += custdiscountfactor;
            else discount += 0.12;
        }

        var sizefat = 0;
        if(vertical){
            if(document.getElementById("inside"+i+"at5").value<=48)sizefat = 48;
            if(document.getElementById("inside"+i+"at5").value<=36)sizefat = 36;
            else if(document.getElementById("inside"+i+"at5").value>48) sizefat = Math.ceil(parseFloat(document.getElementById("inside"+i+"at5").value)/6)*6;
        }
        else {
            sizefat = datahash["SIZE" + Math.ceil(document.getElementById("inside" + i + "at5").value / 6) + Math.ceil(document.getElementById("inside" + i + "at7").value / 12)];
        }

            var sqft = (document.getElementById("TRUESQFT").value == 1) ? ((Math.ceil(document.getElementById("inside" + i + "at5").value / 6)) / 2 * Math.ceil(document.getElementById("inside" + i + "at7").value / 12))
                : (Math.ceil(document.getElementById("inside" + i + "at5").value / 6) * 6 * Math.ceil(document.getElementById("inside" + i + "at7").value / 12) * 12) / 144;
            if (document.getElementById("PLUSONWIDTH").value == "1" && document.getElementById("inside" + i + "at5").value > 66 && !vertical) sizefat /= 1.1;


        var length = parseFloat(document.getElementById("inside"+i+"at7").value);
        var lengthfat = 1.00;
        if(vertical){
            lengthfat = 192.5;
            if(length <= 106.5) lengthfat = 106.5;
            if(length <= 96.5) lengthfat = 96.5;
            if(length <= 82.5) lengthfat = 82.5;
            if(length <= 64.5) lengthfat = 64.5;
            if(length <= 58.5) lengthfat = 58.5;
            if(length <= 52.5) lengthfat = 52.5;
            if(length <= 46.5) lengthfat = 46.5;
            if(length <= 42.5) lengthfat = 42.5;
            if(length <= 32.5) lengthfat = 32.5;
        }
        else {
            if (document.getElementById("TRUESQFT").value == 1) lengthfat += (parseFloat(document.getElementById("NOSHORDISCADD").value !== null)) ? (parseFloat(document.getElementById("NOSHORDISCADD").value) / 100) : 0;
            if (Math.ceil(length / 12) == Math.floor(length / 12) && 3 <= (length / 12) && (length / 12) <= 8)lengthfat -= (parseFloat(document.getElementById("NOSHORDISCADD").value) / 100);
            //modulo does not work in extreme cases length%12 == 0
        }
        var ctrlfat = 0;
        if(document.getElementById("inside"+i+"at12").value == null || document.getElementById("inside"+i+"at12").value == '')document.getElementById("inside"+i+"at12").value = 'C';
        if(document.getElementById("inside"+i+"at1").value.indexOf("VERTICAL") != -1){
            ctrlfat = ctrlhash["V"+document.getElementById("inside"+i+"at12").value];
        }
        else{
            ctrlfat = ctrlhash["H"+document.getElementById("inside"+i+"at12").value];
        }

        var valfact = 0;
        if(vertical){
            if(document.getElementById("inside"+i+"at9").value == 'L')
                valfact = valhash[sizefat];
            else if(document.getElementById("inside"+i+"at9").value == '3V')
                valfact = valhash[sizefat] * 1.7;
            else if(document.getElementById("inside"+i+"at9").value == 'CP')
                valfact = valhash[sizefat] * 0.5;
            else valfact = Math.ceil(document.getElementById("inside"+i+"at7").value/18)*0.3;
        }
        else {
            var twovnvvald = (parseFloat(document.getElementById('TWOVNVVALD').value) / 100) || 0;
            if (document.getElementById("inside" + i + "at9").value === '') {
                if (twovnvvald == null)valfact = 1;
                else valfact = 1 - (twovnvvald + 0.04);
            }
            else if (document.getElementById("inside" + i + "at9").value === '2V')
                valfact = 1 - twovnvvald;
            else valfact = 1;
        }

        custdiscountfactor = 1- (custdiscountfactor*0.01);
        if(document.getElementById("TRUESQFT").value == 1 && !vertical) {
            multiplier=parseFloat(document.getElementById("CONTFAUX").value)*prof*color;
            lengthfat+=parseFloat(document.getElementById("NOSHORDISCADD").value)*0.01;
            sizefat = 1;
            var sub = (Math.ceil(parseFloat(document.getElementById("inside"+i+"at5").value)/6)/2*Math.ceil(parseFloat(document.getElementById("inside"+i+"at7").value)/12)*
                multiplier*lengthfat*valfact+ctrlfat);
        }
        else {
            if (vertical)
                var sub = (color * (prof / 0.1) * (Math.ceil(sizefat / 3) * (lengthfat / 12) * 0.1 + sizefat * base) * ctrlfat + valfact)*custdiscountfactor;
            else var sub = (multiplier * sizefat * lengthfat * valfact * sqft + ctrlfat) * custdiscountfactor;
        }
        document.getElementById("inside"+i+"at"+colCount+"3").value = Math.ceil(sub*100)/100;
        sub *= document.getElementById("inside"+i+"at4").value;
        document.getElementById("inside"+i+"at"+colCount+"4").value = sub;
        if(debug)console.log('PLUSONWIDTH'+document.getElementById("PLUSONWIDTH").value+',TWOVNVVAL'+twovnvvald+',NOSHORDISCADD'+document.getElementById("NOSHORDISCADD").value+'TRUESQFT'+document.getElementById("TRUESQFT").value+'CONTFAUX'+document.getElementById("CONTFAUX").value);
        if(debug)console.log('PRICEsubtotal:'+sub+',multiplier:'+multiplier+',customerdiscount:'+custdiscountfactor+',prod*prof*color:'+multiplier+',sizefac:'+sizefat+',lengthfac:'+lengthfat+',valfac:'+valfact+',sqft:'+sqft+',ctrlfac:'+ctrlfat);
        if(isNaN(parseFloat(sub))){
            document.getElementById("inside"+i+"at"+colCount+"3").value = "INPUT ERROR";
            document.getElementById("inside"+i+"at"+colCount+"4").value = "IGNORED";
        }
        else total += parseFloat(sub);
    }
    document.getElementById("total").value = total;
    var date = $.datepicker.formatDate("mmddyy", new Date());
    document.getElementById('date').value = date.substring(0,4)+date.substring(6);
}

function timeEst(tableID){
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;

    var total = 0, debug=0;
    for(var i = 1; i < rowCount; i++) {
        if(parseInt(document.getElementById("inside"+i+"at4").value,10) > 0) {
            var widthfactor = 1 - (0.2 - document.getElementById("inside" + i + "at5").value / 24 * 0.12);
            var heightfactor = 0.9+document.getElementById("inside"+i+"at5").value/36*0.05;
            var valfactor = (document.getElementById("inside" + i + "at9").value != "") ? 1.2 : 0;
            var mountfactor = (document.getElementById("inside" + i + "at8").value == "IB") ? 1 :
                (document.getElementById("inside" + i + "at8") != "RM").value ?
                0 - production['cutdown'][document.getElementById("inside" + i + "at1").value]
                * production['perpctime'][document.getElementById("inside" + i + "at1").value]
                * heightfactor * widthfactor - production['packaging'][document.getElementById("inside" + i + "at1").value]
                * production['perpctime'][document.getElementById("inside" + i + "at1").value] / 2 : 0;

            var esttime = (valfactor + mountfactor + production['perpctime'][document.getElementById("inside" + i + "at1").value] * heightfactor * widthfactor) * document.getElementById("inside" + i + "at4").value;
           if(debug) console.log(production['perpctime'][document.getElementById("inside" + i + "at1").value]);
           if(debug) console.log('TIMEESTwidth:'+widthfactor + ',heightfac:'+ heightfactor+',valfac:'+valfactor+',MOUNTFAC:'+mountfactor+',ESTTIME:'+esttime);
            total += esttime;
        }
    }
    document.getElementById("REQTIME").value = total;
}

function checkInputs(tableID){
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    for(var i = 1; i < rowCount; i++) {
        if(numberconvert[document.getElementById("inside"+i+"at1").value])
            document.getElementById("inside"+i+"at1").value=numberconvert[document.getElementById("inside"+i+"at1").value];
        if(numberconvert[document.getElementById("inside"+i+"at2").value])
            document.getElementById("inside"+i+"at2").value=numberconvert[document.getElementById("inside"+i+"at2").value];
        if(numberconvert[document.getElementById("inside"+i+"at3").value])
            document.getElementById("inside"+i+"at3").value=numberconvert[document.getElementById("inside"+i+"at3").value];
        if(numberconvert[document.getElementById("inside"+i+"at3").value] == '1\" ALUMINUM')
            document.getElementById("inside"+i+"at3").value='OYSTER';
        if(document.getElementById("inside"+i+"at5").value < 10) {
            alert("Width cannot be less than 10 inches");
            return false;
        }
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