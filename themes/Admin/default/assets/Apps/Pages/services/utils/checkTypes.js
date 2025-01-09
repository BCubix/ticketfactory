export const checkPageBlockTypeChange = (pageHistory, selectedHistory) => {
    for (let i = selectedHistory; i < pageHistory.length; i++) {
        if (pageHistory[i].fields?.pageBlocks) {
            if (Object.values(pageHistory[i].fields?.pageBlocks)?.find((item) => item.pageBlockType !== undefined)) {
                return true;
            }

            let columnsCheck = Object.values(pageHistory[i].fields?.pageBlocks)?.some((pageBlock) => {
                if (!pageBlock?.columns) {
                    return false;
                }

                return Object.values(pageBlock.columns).some((column) => {
                    if (column.type !== undefined) {
                        return true;
                    }

                    return false;
                });
            });

            if (columnsCheck) {
                return true;
            }
        }
    }

    return false;
};

export const checkPageBlockIndexTypeChange = (pageHistory, selectedHistory, blockKey) => {
    for (let i = selectedHistory; i < pageHistory.length; i++) {
        if (pageHistory[i].fields?.pageBlocks && pageHistory[i].fields?.pageBlocks[blockKey]) {
            if (pageHistory[i].fields?.pageBlocks[blockKey]?.pageBlockType !== undefined) {
                return true;
            }

            let columnsCheck = Object.values(pageHistory[i].fields?.pageBlocks).some((column) => {
                if (column.type !== undefined) {
                    return true;
                }

                return false;
            });

            if (columnsCheck) {
                return true;
            }
        }
    }

    return false;
};
