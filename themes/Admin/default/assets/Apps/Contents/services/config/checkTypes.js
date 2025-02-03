export const checkContentTypeChange = (contentHistory, selectedHistory) => {
    for (let i = selectedHistory; i < contentHistory.length; i++) {
        if (contentHistory[i].fields) {
            if (Object.values(contentHistory[i].fields)?.find((item) => item.contentType !== undefined)) {
                return true;
            }
        }
    }

    return false;
};
