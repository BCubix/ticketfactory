export const constructInitialValues = (initialSchema, initialValues, otherParams = {}) => {
    let result = {};

    if (!initialSchema) {
        return result;
    }

    Object.entries(initialSchema).forEach(([key, value]) => {
        if (typeof value === 'function') {
            result[key] = value(initialValues, otherParams);
        } else if (typeof value === 'object') {
            result[key] = constructInitialValues(value, initialValues, otherParams);
        } else {
            result[key] = value;
        }
    });

    return result;
};
