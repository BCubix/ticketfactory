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
