export const getModuleLogo = () => {
    let logos = [];

    const list = require.context(`@/../modules/`, true, /.*\/logo.(jpg|png)$/);

    list.keys().map((item) => {
        logos[item.split('/')[1]] = list(item);
    });

    return logos;
}