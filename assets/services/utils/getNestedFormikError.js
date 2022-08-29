export const getNestedFormikError = (touched, errors, index, name) => {
    if (!touched || !errors) {
        return null;
    }

    let touch = touched[index];

    if (!touch || !touch[name]) {
        return null;
    }

    let err = errors[index];

    if (!err || !err[name]) {
        return null;
    }

    return err[name];
};
