import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';

import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

const TYPE = 'event';

const VALIDATION_TYPE = 'string';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name }) => [1, `Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({ values, handleBlur, setFieldValue, name, errors, field, label, touched }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    const getLinks = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.eventsApi.getEvents();

        if (!result?.result) {
            NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
        }

        setList(result.events);
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

    return (
        <>
            <Component.CmtSelect
                {...{ label, setFieldValue, name }}
                required={field?.options?.required}
                multiple={field?.options?.multiple}
                disabled={field?.options?.disabled}
                id={`eventLink-${name}`}
                value={values[field.name]}
                list={list}
                touched={touched && touched[field.name]}
                errors={errors && errors[field.name]}
                getValue={(item) => item?.id}
                getName={(item) => item?.name}
            />
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
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
};
