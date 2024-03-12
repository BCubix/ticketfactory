import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const TYPE = 'page';

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
            const result = await Api.pagesApi.getAllPages({ lang: languageId, sort: 'title ASC' });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.pages);
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
                id={`pageLink-${name}`}
                value={values[field.name]}
                list={list}
                touched={touched && touched[field.name]}
                errors={errors && errors[field.name]}
                getValue={(item) => item?.id}
                getName={(item) => item?.title}
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
