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
    if(document.getElementById(desc).style.display=='none')document.getElementById(desc).style.display = 'block';
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

