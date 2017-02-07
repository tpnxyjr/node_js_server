$(document).ready(function()
    {
        $(".main").tablesorter();


        var fixHelperModified = function(e, tr) {
                var $originals = tr.children();
                var $helper = tr.clone();
                $helper.children().each(function(index) {
                    $(this).width($originals.eq(index).width())
                });
                return $helper;
            },
            updateIndex = function(e, ui) {
                $('td.index', ui.item.parent()).each(function (i) {
                    $(this).html(i + 1);
                });

                var ids = [];
                $('#sort tbody tr').each(function(){
                    var row = $(this);
                    var id = row.attr("id");
                    ids.push(id);
                });
                //alert(JSON.stringify(ids));
                $.ajax({
                    data: {ids:ids, },
                    dataType: 'json',
                    type: 'POST',
                    url: '/routes/refreshList',
                    success: function(response) {
                        // alert(response); <- Uncomment this to see the server's response
                    }
                });
            };

        $("#sort tbody").sortable({
            helper: fixHelperModified,
            stop: updateIndex
        }).disableSelection();



    }
);

function cSwap(cell){
    if (cell.className == "t")
        cell.className = "t2";
    else if (cell.className == "t2")
        cell.className = "t";
    jQuery(function($) {
        var t2 = [], t=[], parent=[];
        $('td.t2').each(function(){
            var sonum = $(this).next('td').text();
            var temp = $(this).parent().children().index($(this));
            var temp2 = $(this).parent().prev().children().eq(temp).next('td').text();
            t2.push(sonum);
            parent.push(temp2);
        });
        $('td.t').each(function(){
            var sonum = $(this).next('td').text();
            t.push(sonum);
        });
        $.ajax({
            data: {t2:t2, t:t, parent: parent},
            dataType: 'json',
            type: 'POST',
            url: '/routes/refreshList',
            success: function(response) {
            }
        });
    });
}

$('a').click(function(){
    $('<div id="WaitDialog" style="text-align:center;z-index:3;opacity:0.5;width:100%;height:100%;top:0;left:0;right:0;bottom:0;position:absolute; background:black;"><img src="../image/loading.gif" /><div style="margin-top: 10px; color: white; font-size: 25px;"><b>Please wait</b></div></div>').prependTo(document.body);
});