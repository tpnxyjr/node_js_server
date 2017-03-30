$(document).ready(function()    {        $(".main").tablesorter();     }  );

function showolder(){
    var elements = document.getElementsByClassName('older');
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display="";
    }
    document.getElementById('hideolder').style.display='';
}
function hideolder(){
    var elements = document.getElementsByClassName('older');
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display="none";
    }
    document.getElementById('showolder').style.display='';
}