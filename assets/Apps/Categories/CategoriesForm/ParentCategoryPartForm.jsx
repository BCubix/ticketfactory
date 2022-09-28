import { TreeItem, TreeView } from '@mui/lab';
import { Radio, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';

const displayCategoriesOptions = (list, values, setFieldValue) => {
    if (!list || list?.length === 0) {
        return <></>;
    }

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box component="span">
                    <Radio
                        checked={values?.parent === list.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue('parent', values?.parent === list.id ? '' : list.id);
                        }}
                    />
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

export const ParentCategoryPartForm = ({
    values,
    categoriesList,
    setFieldValue,
    touched,
    errors,
}) => {
    const theme = useTheme();

    return (
        <>
            <Typography
                variant="body1"
                sx={{ fontWeight: 500, mt: 2, color: theme.palette.labelColor }}
            >
                Catégorie parente *
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
