import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeItem, TreeView } from '@mui/lab';
import {
    Box,
    Checkbox,
    Chip,
    Typography,
} from '@mui/material';

import { Component } from "@/AdminService/Component";

import { apiMiddleware } from '@Services/utils/apiMiddleware';

const displayCategoriesOptions = (list, values, setValue) => {
    if (!list || list?.length === 0) {
        return <></>;
    }

    const handleCheckCategory = (id) => {
        let categories = [...values];
        const check = categories?.includes(id);

        if (check) {
            categories = categories?.filter((el) => el !== id);
        } else {
            categories.push(id);
        }

        setValue(categories.join(','));
    };

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box display="flex" alignItems={'center'}>
                    <Checkbox
                        checked={values?.includes(list.id?.toString())}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCheckCategory(list.id?.toString());
                        }}
                    />
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) &&
                list?.children?.map((item) => displayCategoriesOptions(item, values, setValue))}
        </TreeItem>
    );
};

export const CmtCategoriesFilters = ({ list, value, setValue, title, label, icon, getList }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const parsedValue = value ? value?.split(',') : [];
    const [displayList, setDisplayList] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetList = () => {
        if (displayList) {
            return;
        }

        if (list) {
            setDisplayList(list);
        }

        if (!getList) {
            return;
        }

        setLoading(true);

        apiMiddleware(dispatch, async () => {
            const result = await getList();

            if (result) {
                setDisplayList(result);
            }

            setLoading(false);
        });
    };

    return (
        <Box mx={1} py={2}>
            <Box display="flex" alignItems="center" justifyContent="center" className="fullHeight">
                <Chip
                    variant={value ? 'default' : 'outlined'}
                    icon={icon}
                    size="medium"
                    label={label}
                    onClick={(e) => {
                        handleGetList();
                        setAnchorEl(e.currentTarget);
                    }}
                    onDelete={value ? () => setValue('') : null}
                />
            </Box>

            <Component.CmtPopover anchorEl={anchorEl} closePopover={() => setAnchorEl(null)}>
                <Box p={5} minWidth={300}>
                    <Typography mb={2} component="p" variant="h4">
                        {title}
                    </Typography>

                    <Typography id={`choice-${title}-label`} size="small" my={3}>
                        {label}
                    </Typography>
                    <TreeView
                        size="small"
                        id={title}
                        value={parsedValue}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={[list.id?.toString()]}
                        defaultExpandIcon={<ChevronRightIcon />}
                        sx={{ flexGrow: 1, overflowY: 'auto' }}
                    >
                        {displayCategoriesOptions(list, parsedValue, setValue)}
                    </TreeView>
                </Box>
            </Component.CmtPopover>
        </Box>
    );
};
