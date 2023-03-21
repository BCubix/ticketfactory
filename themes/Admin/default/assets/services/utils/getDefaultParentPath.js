export const getDefaultParentPath = (list, parentId) => {
    let path = [];

    if (list?.id === parentId) {
        return [parentId.toString()];
    } else if (list?.children?.length === 0) {
        return [];
    } else {
        list?.children?.forEach((children) => {
            let childrenPath = getDefaultParentPath(children, parentId);
            if (childrenPath.length > 0) {
                path = childrenPath;
            }
        });
    }

    if (path.length > 0) {
        return [list?.id?.toString(), ...path];
    }

    return [];
};
