var is_installing = false;
$(document).ready(function () {
    start_install();
});

var current_step = 0;
function start_install() {
    // If we are already installing PrestaShop, do not trigger action again
    if (is_installing) {
        return;
    }

    is_installing = true;

    $('.process_step').removeClass('fail').removeClass('success').slideUp().hide();
    $('#progress_bar').show();
    $('#progress_bar .installing').show();
    $('#error_process').hide();

    process_install();
}

function process_install(step) {
    if (!step) {
        step = process_steps[0];
    }

    $('#process_step_' + step.key).slideDown();
    $('.installing')
        .hide()
        .html('Etape en cours : ' + step.step + '...');

    $.ajax({
        url: 'index.php',
        data: step.key + '=true',
        dataType: 'json',
        cache: false,
        success: function (json) {
            // No error during this step
            if (json && json.success === true) {
                $('#process_step_' + step.key).addClass('success');
                current_step++;
                if (current_step >= process_steps.length) {
                    $('#progress_bar .total span').html('100%');

                    // Installation finished
                    setTimeout(function () {
                        install_success();
                    }, 700);
                } else {
                    $('#progress_bar .total span').html(Math.ceil(current_step * (100 / process_steps.length)) + '%');

                    // Process next step
                    process_install(process_steps[current_step]);
                }
            } else {
                install_error(step, json ? json.message : '');
            }
        },
        // An error HTTP (page not found, json not valid, etc.) occurred during this step
        error: function (jqXHR, textStatus) {
            var errorMsg = 'HTTP ' + jqXHR.status + ' - ' + textStatus + ' - ' + jqXHR.responseText;
            install_error(step, errorMsg);
        },
    });
}

function install_error(step, errors) {
    current_step = 0;
    is_installing = false;

    $('#error_process').show();
    $('#process_step_' + step.key)
        .show()
        .addClass('fail');
    $('#progress_bar .installing').slideUp();

    if (errors) {
        var list_errors = errors;

        switch (typeof list_errors) {
            case 'string':
                list_errors = [errors];
                break;

            case 'array':
                list_errors = [list_errors[0]];
                break;

            case 'object':
                let err = [];
                $.each(list_errors, function (prop, val) {
                    if (typeof val === 'array') {
                        val = val.map(function (v) {
                            return '<li>' + v + '</li>';
                        });
                    }
                    err.push(prop + ' <ul>' + val + '</ul>');
                });
                list_errors = err;
                break;
        }

        var display = '<ul class="errorBlock">';
        $.each(list_errors, function (k, v) {
            display += '<li>' + (k + 1) + ': ' + v.replace(/\n/g, '<br>') + '</li>';
        });

        display += '</ul>';
        $('#error_process').append(display);
    }
}

function install_success() {
    $('#progress_bar .total').hide();
    $('.installing').html(install_is_done).show();

    is_installing = false;
    $('.process_list').slideUp();
    $('#error_process').hide();
    $('#btnEnd').show();
}
