import { copyData } from '@Services/utils/copyData';
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
        let categories = [...values?.mediaCategories];
        const check = categories?.includes(id);

        if (check) {
            categories = categories?.filter((el) => el !== id);
            setFieldValue('mediaCategories', categories);
        } else {
            categories.push(id);
            setFieldValue('mediaCategories', categories);

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
                        checked={values?.mediaCategories?.includes(list.id)}
                        id={`mediaCategoriesValue-${list.id}`}
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
                                if (!values?.mediaCategories?.includes(list.id)) {
                                    let categories = values.mediaCategories;
                                    categories.push(list.id);
                                    setFieldValue('mediaCategories', categories);
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

export const MediaParentCategoryPartForm = ({ values, mediaCategoriesList, setFieldValue, touched, errors, sx }) => {
    const defaultExpend = useMemo(() => {
        let list = [];

        values?.mediaCategories?.forEach((el) => {
            list.push(...getDefaultParentPath(mediaCategoriesList, el));
        });
        list.push(...getDefaultParentPath(mediaCategoriesList, values?.mainCategory));

        return list;
    }, []);

    return (
        <>
            <Box display="flex" justifyContent={'space-between'} {...sx}>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Catégories
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Catégorie principale
                </Typography>
            </Box>
            <TreeView
                size="small"
                id="categoriesParent"
                label="Catégories"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={[mediaCategoriesList.id?.toString(), ...defaultExpend]}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
                {displayCategoriesOptions(mediaCategoriesList, values, setFieldValue)}
            </TreeView>
            {touched?.mediaCategories && errors?.mediaCategories && (
                <Typography sx={{ fontSize: 12 }} color="error" id="mediaCategories-helper-text">
                    {touched?.mediaCategories && errors?.mediaCategories}
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
