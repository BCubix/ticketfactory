export const getModuleLogo = (moduleName) => {
    const list = require.context(`@/../modules`, true, /.*\/logo.(jpg|png)$/);

    for (const item of list.keys()) {
        if (item.split('/')[1] === moduleName) {
            return list(item);
        }
    }

    return null;
}