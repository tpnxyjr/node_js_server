function script(e,i){
    if(e.keycode == 13){
        document.getElementById("sofield").submit();
    }
}
window.onload=function(){
    if (document.getElementById("SONUM").value != null) {
        populateTable("body");
    }
};
function populateTable (tableID){
    var table = document.getElementById(tableID);
    var SO = document.getElementById(sonum);


}