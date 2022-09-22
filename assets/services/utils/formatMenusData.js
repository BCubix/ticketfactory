export const formatMenusData = (data) => {
    var newData = []
    
    data?.forEach(el => {
        newData.push({...el, subMenu: formatMenusData(el.subMenu)});
    })

    return newData;
}