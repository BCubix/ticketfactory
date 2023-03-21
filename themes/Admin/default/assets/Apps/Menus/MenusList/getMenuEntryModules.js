export default function getMenuEntryModules() {
    let components = {};

    const list = require.context('@/Modules/', true, /\MenuEntryModule.jsx$/);

    list.keys().map((item) => {
        const component = list(item).default;
        const name = component.MENU_TYPE;

        components[name] = component;
    });

    return components;
}
