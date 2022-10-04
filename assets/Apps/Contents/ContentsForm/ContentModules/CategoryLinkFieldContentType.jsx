import { TreeItem, TreeView } from '@mui/lab';
import { FormControl, Radio, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { REDIRECTION_TIME } from '../../../../Constant';
import authApi from '../../../../services/api/authApi';
import categoriesApi from '../../../../services/api/categoriesApi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box } from '@mui/system';

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
            {Array.isArray(list?.children) &&
                list?.children?.map((item) =>
                    displayCategoriesOptions(item, values, setFieldValue, name, field)
                )}
        </TreeItem>
    );
};

const FormComponent = ({
    values,
    handleBlur,
    setFieldValue,
    name,
    errors,
    field,
    label,
    touched,
}) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    const getLinks = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await categoriesApi.getCategories();

        if (!result?.result) {
            NotificationManager.error(
                'Une erreur est survenue, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
        }

        setList(result.categories);
    };

    useEffect(() => {
        getLinks();
    }, []);

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
                    defaultExpanded={[list.id?.toString()]}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                    selected={values[field.name]?.toString()}
                >
                    {displayCategoriesOptions(list, values, setFieldValue, name, field)}
                </TreeView>

                {touched && touched[field.name] && errors && errors[field.name] && (
                    <FormHelperText error>{errors[field.name]}</FormHelperText>
                )}
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
    FormComponent,
    getInitialValue,
};
