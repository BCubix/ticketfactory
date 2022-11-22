export function objectResolver(path, obj = null, separator = '.') {
    if (!obj) {
        return '';
    }

    var properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}
