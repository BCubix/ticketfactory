export default function getMenuEntryModules() {
    let components = {};

    const list = require.context('@/Modules/', true, /\MenuEntryModule.jsx$/);

    list.keys().map((item) => {
        const name = item.split('/').at(-1).replace('./', '').replace('.jsx', '');

        components[name] = list(item).default;
    });

    console.log(components);

    return components;
}
