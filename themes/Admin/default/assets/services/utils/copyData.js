export const copyData = (data) => {
    let newData = {};

    if (data !== null && Array.isArray(data)) {
        newData = [...data.map((el) => copyData(el))];
    } else if (typeof data === 'function') {
        return data;
    } else if (data !== null && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && Array.isArray(value)) {
                let arr = value.map((el) => copyData(el));
                newData[key] = arr;
            } else if (value !== null && typeof value === 'object') {
                newData[key] = copyData(value);
            } else if (typeof value === 'function') {
                newData[key] = value;
            } else {
                newData[key] = value !== null ? value : '';
            }
        });
    } else {
        return data;
    }

    return newData;
};
