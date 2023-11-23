export const constructInitialValues = (initialSchema, initialValues, props) => {
    let result = {};

    if (!initialSchema) {
        return result;
    }

    Object.entries(initialSchema).forEach(([key, value]) => {
        if (typeof value === 'function') {
            result[key] = value(initialValues, props);
        } else if (typeof value === 'object') {
            result[key] = constructInitialValues(value, initialValues, props);
        } else {
            result[key] = value;
        }
    });

    return result;
};
