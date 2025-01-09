import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Box } from '@mui/material';

const LABEL = 'Lien vers un tag';
const TYPE = 'tag';
const TYPE_GROUP_NAME = 'Liens';

const FormComponent = ({ value, errors, touched, name, label, languageId, setFieldValue }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    const getLinks = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.tagsApi.getAllTags({ lang: languageId, sort: 'name ASC' });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.tags);
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

    return (
        <Box className="margin-3">
            <Component.CmtSelect
                {...{ label, setFieldValue, name }}
                id={`tagLink-${name}`}
                value={value}
                list={list}
                touched={touched}
                errors={errors}
                getValue={(item) => item?.id}
                getName={(item) => item?.name}
            />
        </Box>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
};
