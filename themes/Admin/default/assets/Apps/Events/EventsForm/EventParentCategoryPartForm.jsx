import React, { useMemo } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeView, TreeItem } from '@mui/lab';
import { Typography, Radio, Checkbox, Box } from '@mui/material';

import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';

const displayCategoriesOptions = (list, values, setFieldValue) => {
    if (!list || list?.length === 0) {
        return <></>;
    }

    const handleCheckCategory = (id) => {
        let categories = [...values?.eventCategories];
        const check = categories?.includes(id);

        if (check) {
            categories = categories?.filter((el) => el !== id);
            setFieldValue('eventCategories', categories);
        } else {
            categories.push(id);

            setFieldValue('eventCategories', categories);
        }
    };

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box display="flex" alignItems={'center'}>
                    <Checkbox
                        checked={values?.eventCategories?.includes(list.id)}
                        id={`eventCategoriesValue-${list.id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCheckCategory(list.id);
                        }}
                    />
                    {list?.name}
                    <Box component="span" sx={{ ml: 'auto' }}>
                        <Radio
                            checked={values?.mainCategory === list.id}
                            id={`mainCategoryValue-${list.id}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!values?.eventCategories?.includes(list.id)) {
                                    let categories = values.eventCategories;
                                    categories.push(list.id);
                                    setFieldValue('eventCategories', categories);
                                }

                                setFieldValue('mainCategory', list.id);
                            }}
                        />
                    </Box>
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategoriesOptions(item, values, setFieldValue))}
        </TreeItem>
    );
};

export const EventParentCategoryPartForm = ({ values, categoriesList, setFieldValue, touched, errors }) => {
    const defaultExpend = useMemo(() => {
        return getDefaultParentPath(categoriesList, values?.mainCategory);
    }, []);

    return (
        <>
            <Box display="flex" justifyContent={'space-between'}>
                <Typography variant="body1" sx={{ mt: 2 }} className="required-input">
                    Catégories
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }} className="required-input">
                    Catégorie principale
                </Typography>
            </Box>
            <TreeView
                size="small"
                id="categoriesParent"
                label="Catégories"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={[categoriesList.id?.toString(), ...defaultExpend]}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
                {displayCategoriesOptions(categoriesList, values, setFieldValue)}
            </TreeView>
            {touched?.eventCategories && errors?.eventCategories && (
                <Typography sx={{ fontSize: 12 }} color="error" id="eventCategories-helper-text">
                    {touched?.eventCategories && errors?.eventCategories}
                </Typography>
            )}
            {touched?.mainCategory && errors?.mainCategory && (
                <Typography sx={{ fontSize: 12 }} color="error" id="mainCategory-helper-text">
                    {touched?.mainCategory && errors?.mainCategory}
                </Typography>
            )}
        </>
    );
};
