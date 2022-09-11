export default function ContentTypesModules() {
    let components = {};

    const list = require.context('./', true, /\.jsx$/);

    list.keys().map((item) => {
        components[item.replace('./', '').replace('.jsx', '')] = list(item).default;
    });

    return components;
}
