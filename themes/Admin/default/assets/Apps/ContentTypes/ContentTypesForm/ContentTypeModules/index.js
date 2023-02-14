export default function ContentTypesModules() {
    let components = {};

    const list = require.context('./', true, /\.jsx$/);

    list.keys().map((item) => {
        const component = list(item).default;
        const name = component.TYPE;

        components[name] = component;
    });

    return components;
}
