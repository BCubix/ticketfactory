$(document).ready(function () {
    $('#btNext').prop('disabled', !$('#set_license').prop('checked'));

    $('#set_license').change(function () {
        $('#btNext').prop('disabled', !this.checked);
    });
});
