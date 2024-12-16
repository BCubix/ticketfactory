export const getPropByString = (object, path, defaultValue = undefined) => {
    let result = path
        .split(/[\.\[\]\'\"]/)
        .filter((p) => p)
        .reduce((o, p) => (o ? o[p] : defaultValue), object);
    return result;
};
