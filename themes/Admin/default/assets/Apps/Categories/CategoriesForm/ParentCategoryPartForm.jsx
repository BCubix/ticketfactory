import React, { useMemo } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeItem, TreeView } from '@mui/lab';
import { InputLabel, Radio, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';

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
                            if (values?.id === list.id) {
                                return;
                            }
                            setFieldValue('parent', values?.parent === list.id ? '' : list.id);
                        }}
                        id={`parentCategoryValue-${list.id}`}
                    />
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategoriesOptions(item, values, setFieldValue))}
        </TreeItem>
    );
};

export const ParentCategoryPartForm = ({ values, categoriesList, setFieldValue, touched, errors }) => {
    if (!categoriesList) {
        return <></>;
    }

    const defaultExpend = useMemo(() => {
        return getDefaultParentPath(categoriesList, values.parent);
    }, []);

    return (
        <>
            <InputLabel id={`categoriesParent-label`} required sx={{ fontSize: '12px' }}>
                Catégorie parente
            </InputLabel>
            <TreeView
                size="small"
                id="categoriesParent"
                value={values.parent}
                label="Catégorie parent"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={[categoriesList.id?.toString(), ...defaultExpend]}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
                selected={values?.parent?.toString()}
            >
                {displayCategoriesOptions(categoriesList, values, setFieldValue)}
            </TreeView>
            {touched?.parent && errors?.parent && (
                <Typography sx={{ fontSize: 12 }} color="error" id="parent-helper-text">
                    {errors?.parent}
                </Typography>
            )}
        </>
    );
};
