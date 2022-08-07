import React from 'react';
import { CmtTabs } from '../../../Components/CmtTabs/CmtTabs';
import { CATEGORIES_BASE_PATH, TAGS_BASE_PATH } from '../../../Constant';
import { TagsList } from '../../Tags/TagsList/TagsList';
import { CategoriesList } from '../CategoriesList/CategoriesList';

export const CategoriesMenu = ({ tabValue = 0 }) => {
    return (
        <CmtTabs
            tabValue={tabValue}
            list={[
                { label: 'Catégories', component: <CategoriesList />, path: CATEGORIES_BASE_PATH },
                { label: 'Tags', component: <TagsList />, path: TAGS_BASE_PATH },
            ]}
        />
    );
};
