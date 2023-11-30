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
        let categories = [...values?.productCategories];
        const check = categories?.includes(id);

        if (check) {
            categories = categories?.filter((el) => el !== id);
            setFieldValue('productCategories', categories);
        } else {
            categories.push(id);
            setFieldValue('productCategories', categories);

            if (!values.mainCategory) {
                setFieldValue('mainCategory', id);
            }
        }
    };

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box display="flex" alignItems={'center'}>
                    <Checkbox
                        checked={values?.productCategories?.includes(list.id)}
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
                                if (!values?.productCategories?.includes(list.id)) {
                                    let categories = values.productCategories;
                                    categories.push(list.id);
                                    setFieldValue('productCategories', categories);
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

export const ProductParentCategoryPartForm = ({ values, productCategoriesList, setFieldValue, touched, errors }) => {
    const defaultExpend = useMemo(() => {
        let list = [];

        values?.productCategories?.forEach((el) => {
            list.push(...getDefaultParentPath(productCategoriesList, el));
        });
        list.push(...getDefaultParentPath(productCategoriesList, values?.mainCategory));

        return list;
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
                defaultExpanded={[productCategoriesList.id?.toString(), ...defaultExpend]}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
                {displayCategoriesOptions(productCategoriesList, values, setFieldValue)}
            </TreeView>
            {touched?.productCategories && errors?.productCategories && (
                <Typography sx={{ fontSize: 12 }} color="error" id="productCategories-helper-text">
                    {touched?.productCategories && errors?.productCategories}
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
