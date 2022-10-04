import {
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { REDIRECTION_TIME } from '../../../../Constant';
import authApi from '../../../../services/api/authApi';
import tagsApi from '../../../../services/api/tagsApi';

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

        const result = await tagsApi.getTags();

        if (!result?.result) {
            NotificationManager.error(
                'Une erreur est survenue, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
        }

        setList(result.tags);
    };

    useEffect(() => {
        getLinks();
    }, []);

    return (
        <>
            <FormControl fullWidth>
                <InputLabel id={`tagLink-${label}-label`} size="small">
                    {label}
                </InputLabel>
                <Select
                    labelId={`tagLink-${label}-label`}
                    id={`tagLink-${label}`}
                    size="small"
                    variant="standard"
                    value={values[field.name]}
                    label={label}
                    onChange={(e) => {
                        setFieldValue(name, e.target.value);
                    }}
                    name={name}
                    onBlur={handleBlur}
                >
                    {list?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                            <ListItemText>{item.name}</ListItemText>
                        </MenuItem>
                    ))}
                </Select>
                {touched && touched[field.name] && errors && errors[field.name] && (
                    <FormHelperText error>{errors[field.name]}</FormHelperText>
                )}
            </FormControl>
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 3 }}>
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
