import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getTagsAction } from '@Redux/tags/tagsSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateTag = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const tagId = queryParameters.get('tagId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            if (!tagId || !languageId) {
                return;
            }

            let tag = await Api.tagsApi.getTranslated(tagId, languageId);
            if (!tag?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.EVENTS_BASE_PATH);
                return;
            }

            tag.tag.lang = parseInt(languageId);
            setInitialValues(tag.tag);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.tagsApi.createTag(values);
            if (result.result) {
                NotificationManager.success('Le tag a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getTagsAction());
                navigate(Constant.TAGS_BASE_PATH);
            }
        });
    };

    if (tagId && !initialValues) {
        return <></>;
    }

    return <Component.TagsForm handleSubmit={handleSubmit} translateInitialValues={initialValues} />;
};
