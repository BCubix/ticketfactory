export const constructInitialValues = (initialSchema, initialValues) => {
    let result = {};

    if (!initialSchema) {
        return result;
    }

    Object.entries(initialSchema).forEach(([key, value]) => {
        if (typeof value === 'function') {
            result[key] = value(initialValues);
        } else if (typeof value === 'object') {
            result[key] = constructInitialValues(value, initialValues);
        } else {
            result[key] = value;
        }
    });

    return result;
};
