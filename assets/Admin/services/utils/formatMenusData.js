export const formatMenusData = (data) => {
    var newData = [];

    data?.forEach((el) => {
        newData.push({ ...el, children: formatMenusData(el.children) });
    });

    return newData;
};
