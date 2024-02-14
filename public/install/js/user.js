$(document).ready(function () {
    $('.errorBlock').hide();
    $('.errorPassword').hide();

    $('.field-password .userInfos').show();

    $('#infosPassword').on('input', function () {
        let isPasswordValid = checkPwLength(this.value);
        isPasswordValid &= checkPwUpper(this.value);
        isPasswordValid &= checkPwLower(this.value);
        isPasswordValid &= checkPwNumber(this.value);
        isPasswordValid &= checkPwLength(this.value);
        isPasswordValid &= checkPwSpecial(this.value);

        if (isPasswordValid) {
            $('.errorBlock').hide();
            $('.field-password .userInfos').show();
        } else {
            $('.errorBlock').show();
            $('.field-password .userInfos').hide();
        }
    });
});

function checkPwLength(password) {
    let isValid = password.length >= 10;
    if (isValid) {
        $('.errorPassword#pwLength').hide();
    } else {
        $('.errorPassword#pwLength').show();
    }
    return isValid;
}

function checkPwUpper(password) {
    let isValid = /[A-Z]/.test(password);
    if (isValid) {
        $('.errorPassword#pwUpper').hide();
    } else {
        $('.errorPassword#pwUpper').show();
    }
    return isValid;
}

function checkPwLower(password) {
    let isValid = /[a-z]/.test(password);
    if (isValid) {
        $('.errorPassword#pwLower').hide();
    } else {
        $('.errorPassword#pwLower').show();
    }
    return isValid;
}

function checkPwNumber(password) {
    let isValid = /\d/.test(password);
    if (isValid) {
        $('.errorPassword#pwNumber').hide();
    } else {
        $('.errorPassword#pwNumber').show();
    }
    return isValid;
}

function checkPwSpecial(password) {
    let isValid = /[\W_]/.test(password);
    if (isValid) {
        $('.errorPassword#pwSpecial').hide();
    } else {
        $('.errorPassword#pwSpecial').show();
    }
    return isValid;
}
