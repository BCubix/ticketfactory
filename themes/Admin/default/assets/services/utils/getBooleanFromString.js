export const getBooleanFromString = (value) => {
    if (!value) {
        return null;
    }

    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }

    return null;
};
