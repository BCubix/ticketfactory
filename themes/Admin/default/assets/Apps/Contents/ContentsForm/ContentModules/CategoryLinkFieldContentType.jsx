import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeItem, TreeView } from '@mui/lab';
import { FormControl, FormHelperText, Radio, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';

const TYPE = 'category';

const VALIDATION_TYPE = 'string';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name }) => [1, `Veuillez renseigner le champ ${name}`],
    },
];

const displayCategoriesOptions = (list, values, setFieldValue, name, field) => {
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
                        checked={values[field.name] === list.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue(name, values[field.name] === list.id ? '' : list.id);
                        }}
                    />
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategoriesOptions(item, values, setFieldValue, name, field))}
        </TreeItem>
    );
};

const FormComponent = ({ values, setFieldValue, name, errors, field, label, touched }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    const getLinks = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.categoriesApi.getCategories();

        if (!result?.result) {
            NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
        }

        setList(result.categories);
    };

    useEffect(() => {
        getLinks();
    }, []);

    useEffect(() => {
        if (!values[field.name]) {
            return;
        }

        setFieldValue(name, values[field.name]?.id || values[field.name]);
    }, []);

    const defaultExpend = useMemo(() => {
        if (!list) {
            return [];
        }

        return getDefaultParentPath(list, values[field.name]);
    }, [list]);

    if (!list || list.length === 0) return <></>;

    return (
        <>
            <FormControl fullWidth>
                <Typography id={`categoryLink-${label}-label`} component="p" variant="body1">
                    {label}
                </Typography>

                <TreeView
                    size="small"
                    id={`categoryLink-${label}`}
                    value={values[field.name]}
                    label={label}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={[list.id?.toString(), ...defaultExpend]}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                    selected={values[field.name]?.toString()}
                >
                    {displayCategoriesOptions(list, values, setFieldValue, name, field)}
                </TreeView>

                {touched && touched[field.name] && errors && errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
            </FormControl>
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
};
