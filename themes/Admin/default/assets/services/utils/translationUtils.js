export const sortTranslatedObject = (list) => {
    let newList = [];

    list.forEach((element) => {
        const index = newList.findIndex((el) => el.languageGroup === element.languageGroup && el.id !== element.id);

        if (index > -1) {
            if (!newList[index].translatedElements) {
                newList[index].translatedElements = [];
            }

            newList[index].translatedElements.push(element);
        } else {
            newList.push({ ...element, translatedElements: [] });
        }
    });

    return newList;
};

export const getAvailableLanguages = (list, languagesData) => {
    if (!list || !list?.lang) {
        return [];
    }

    let listId = [];
    listId.push(list?.lang?.id);

    list?.translatedElements?.forEach((el) => listId.push(el.lang.id));

    return languagesData?.languages?.filter((el) => !listId.includes(el.id));
};

export const getLanguagesFromTranslatedElement = (element) => {
    const list = [element.lang];

    element?.translatedElements?.forEach((el) => {
        list.push(el.lang);
    });

    return list;
};
