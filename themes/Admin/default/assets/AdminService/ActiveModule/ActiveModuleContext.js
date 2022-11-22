export function ActiveModuleContext(modulesActive) {
    if (!modulesActive)
        return;

    const list = require.context(`@/../../../../modules`, true, /\.*\/assets\/index.js$/);

    list.keys().map((item) => {
        const arrayPath = item.split('/');
        if (!arrayPath || arrayPath.length < 1)
            return;

        const moduleName = arrayPath[1];

        if (modulesActive.find(moduleActive => moduleActive.name === moduleName)) {
            const func = list(item).default;

            if (typeof func === "function" && func.name === "active")
                func();
        }
    });
}