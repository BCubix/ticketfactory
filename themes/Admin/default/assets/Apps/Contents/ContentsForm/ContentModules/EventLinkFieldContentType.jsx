import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

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

const FormComponent = ({ values, setFieldValue, name, errors, field, label, touched, languageId }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    const getLinks = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.eventsApi.getAllEvents({ lang: languageId, sort: 'name ASC' });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.events);
        });
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
                value={list.length > 0 ? values[field.name]?.id || values[field.name] || '' : ''}
                list={list}
                touched={touched && touched[field.name]}
                errors={errors && errors[field.name]}
                getValue={(item) => item?.id}
                getName={(item) => item?.name}
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 10 }}>
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
