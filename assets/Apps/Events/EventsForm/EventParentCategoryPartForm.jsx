import { TreeView, TreeItem } from '@mui/lab';
import { Typography, Radio, Checkbox, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';

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
                <Box component="span">
                    <Checkbox
                        checked={values?.eventCategories?.includes(list.id)}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCheckCategory(list.id);
                        }}
                    />
                    {console.log(values)}
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) &&
                list?.children?.map((item) =>
                    displayCategoriesOptions(item, values, setFieldValue)
                )}
        </TreeItem>
    );
};

export const EventParentCategoryPartForm = ({
    values,
    categoriesList,
    setFieldValue,
    touched,
    errors,
}) => {
    return (
        <>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Catégorie parente
            </Typography>
            <TreeView
                size="small"
                id="categoriesParent"
                value={values.parent}
                label="Catégorie parent"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={[categoriesList.id?.toString()]}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
                selected={values?.parent?.toString()}
            >
                {displayCategoriesOptions(categoriesList, values, setFieldValue)}
            </TreeView>
            <Typography sx={{ fontSize: 12 }} color="error">
                {touched?.parent && errors?.parent}
            </Typography>
        </>
    );
};
