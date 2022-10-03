function ParametersTypesModules() {
    let components = {};

    const list = require.context('./', true, /\.jsx$/);

    list.keys().map((item) => {
        components[list(item).default.getType()] = list(item).default;
    });

    return components;
}

export default ParametersTypesModules;