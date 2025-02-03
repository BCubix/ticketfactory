export function getNextFieldValue(versions, currentIndex, fieldPath) {
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
    };

    for (let i = currentIndex + 1; i < versions.length; i++) {
        const nextValue = getNestedValue(versions[i], fieldPath);

        if (nextValue !== undefined) {
            return nextValue;
        }
    }

    return undefined;
}
