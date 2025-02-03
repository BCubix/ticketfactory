export const createFilterParams = (values, filterList, params) => {
    if (!filterList || !values) {
        return;
    }

    filterList.forEach((element) => {
        let filter = null;

        if (typeof element === 'object') {
            filter = values[element.key];

            if (filter === 0 || filter || filter === false) {
                if (element.transformFilter) {
                    element.transformFilter(params, filter);
                } else {
                    params[element?.sortName || `filters[${element?.key}]`] = element?.type === 'boolean' ? (filter ? 1 : 0) : filter;
                }
            }
        } else {
            filter = values[element];

            if (filter === 0 || filter || filter === false) {
                params[`filters[${element}]`] = filter;
            }
        }
    });
};
