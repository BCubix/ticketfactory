export const createFilterParams = (values, filterList, params) => {
    if (!filterList || !values) {
        return;
    }

    filterList.forEach((element) => {
        const filter = values[element.name];

        if (filter === 0 || (filter || filter === false)) {
            if (element.transformFilter) {
                element.transformFilter(params, filter);
            } else {
                params[element.sortName] = filter;
            }
        }
    });
};
