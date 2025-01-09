import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';
import { Box, FormControl, FormHelperText, Radio, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LABEL = 'Lien vers une catégorie';
const TYPE = 'category';
const TYPE_GROUP_NAME = 'Liens';

const displayCategoriesOptions = (list, value, setFieldValue, name) => {
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
                        checked={value == list.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue(name, value == list.id ? '' : list.id);
                        }}
                    />
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategoriesOptions(item, value, setFieldValue, name))}
        </TreeItem>
    );
};

const FormComponent = ({ value, errors, touched, name, label, languageId, setFieldValue }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    const getLinks = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.categoriesApi.getCategories({ lang: languageId });

            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.categories);
        });
    };

    useEffect(() => {
        getLinks();
    }, []);

    useEffect(() => {
        if (!value) {
            return;
        }

        setFieldValue(name, value?.id || value);
    }, []);

    const defaultExpend = useMemo(() => {
        if (!list) {
            return [];
        }

        return getDefaultParentPath(list, value);
    }, [list]);

    if (!list || list.length === 0) return <></>;

    return (
        <Box className="margin-3">
            <FormControl fullWidth>
                <Typography id={`categoryLink-${label}-label`} component="p" variant="body1">
                    {label}
                </Typography>

                <TreeView
                    size="small"
                    id={`categoryLink-${label}`}
                    value={value}
                    label={label}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={[list.id?.toString(), ...defaultExpend]}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                    selected={value?.toString()}
                >
                    {displayCategoriesOptions(list, value, setFieldValue, name)}
                </TreeView>

                {touched && errors && <FormHelperText error>{errors}</FormHelperText>}
            </FormControl>
        </Box>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
};
