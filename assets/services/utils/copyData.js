export const copyData = (data) => {
    const newData = {};

    Object.entries(data).map(([key, value]) => {
        if (null !== value && Array.isArray(value)) {
            let arr = [];

            value.forEach((el, index) => {
                arr.push(copyData(el));
            });

            newData[key] = [...arr];
        } else if (null !== value && typeof value === 'object') {
            newData[key] = copyData(value);
        } else {
            newData[key] = value;
        }
    });

    return newData;
};
