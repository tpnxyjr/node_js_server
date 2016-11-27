$(document).ready(function() {
    if($('#button').attr('id'))$('#button').attr('id').on('show.bs.collapse', function () {
        $('#local-reg').attr('id').collapse('hide');
        $('#local-sign-in').attr('id').collapse('hide');
    })
    if($('#button1').attr('id'))$('#button1').attr('id').on('show.bs.collapse', function () {
        $('#local-reg').attr('id').collapse('hide');
    })
    if($('#button2').attr('id'))$('#button2').attr('id').on('show.bs.collapse', function () {
        $('#local-sign-in').attr('id').collapse('hide');
    })
});