const   EMAIL_EMPTY = 'Enter an email address.',
        EMAIL_INVALID = 'Invalid email.',
        PASSWORD_CONFIRM_EMPTY = 'Confirm your password.',
        PASSWORD_EMPTY = ['Enter a password (minimum of ', ' characters).'],
        PASSWORD_INVALID = ['Invalid password (minimum of ', ' characters).'],
        PASSWORD_MISMATCH = 'Passwords do not match.';

exports.formValidate = (formData) => {
    let firstPassword;
    let resultsObj = {};

    for (var key in formData) {
        let result;

        switch (formData[key].validationType) {
            case 'email' :
                result = this.emailValidate(formData[key].value);
                break;
            case 'password' :
                firstPassword = formData[key].value;
                result = this.passwordValidate(formData[key].value, formData[key].params);
                break;
            case 'match' :
                result = this.inputMatch(firstPassword, formData[key].value);
                break;
        }
        resultsObj[key] = result;
    }
    return resultsObj;
}

exports.emailValidate = (email) => {
    if (email.required && !email) {
        return EMAIL_EMPTY;
    }

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        return EMAIL_INVALID;
    }

    return true;
}

exports.passwordValidate = (password, params) => {
    if (password.required && !password) {
        return PASSWORD_EMPTY[0] + params.minimumLength + PASSWORD_EMPTY[1];
    }

    if (params.minimumLength && password.length < params.minimumLength ) {
        return PASSWORD_INVALID[0] + params.minimumLength  + PASSWORD_INVALID[1];
    }

    /*
     // Upper character detection here
     if (params.upperChar) {

     }

     // Special character detection here
     if (params.specialChar) {

     }
     */

    return true;
    
}

exports.inputMatch = (password1, password2) => {
    if (password2.required && !password2) {
        return PASSWORD_CONFIRM_EMPTY ;
    }

    if (password1 !== password2) {
        return PASSWORD_MISMATCH;
    }

    return true;
}