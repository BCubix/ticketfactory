export const sortTranslatedObject = (list) => {
    let newList = [];

    list.forEach((element) => {
        const index = newList.findIndex((el) => el.languageGroup === element.languageGroup);

        if (index > -1) {
            newList[index].translatedElements.push(element);
        } else {
            newList.push({ ...element, translatedElements: [] });
        }
    });

    return newList;
};
