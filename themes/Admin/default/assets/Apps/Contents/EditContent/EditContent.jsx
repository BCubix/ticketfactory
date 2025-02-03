import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getContentsAction } from '@Apps/Contents/redux/contents/contentsSlice';
import { contentTypesSelector, getContentTypesAction } from '@Apps/ContentTypes/redux/contentTypes/contentTypesSlice';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { Crud } from '@/AdminService/Crud';
import { contentsInitialSchema, contentsValidationSchema, contentsForm } from '../ContentsForm/ContentsForm';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { getUserRoles } from '@Services/utils/getUserRoles';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const ROLE_CONTENT_PUBLISH = 'ROLE_CONTENT_PUBLISH';

export const contentsEditCrud = {
    form: {
        title: "Creation d'un contenu",
        initialSchema: contentsInitialSchema,
        validationSchema: contentsValidationSchema,
    },
    ...contentsForm,
};

export const EditContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(userProfileSelector);
    const { id } = useParams();
    const [content, setContent] = useState(null);
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentsApi.editContent(id, values);
            if (result.result) {
                NotificationManager.success('Le contenu a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getContentsAction(`contentType_${content.contentType.id}`));
                navigate(Constant.CONTENTS_BASE_PATH);
            }
        });
    };

    const getContent = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.contentsApi.getOneContent(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CONTENTS_BASE_PATH);
                return;
            }

            setContent(result.content);
        });
    };

    const publicationStatusList = useMemo(() => {
        if (checkUserAccess(getUserRoles(user), ROLE_CONTENT_PUBLISH)) {
            return Crud.contents.edit.publicationStatusList;
        }

        return Crud.contents.edit.publicationStatusList?.filter((item) => item.value !== 'PUBLISHED');
    }, []);

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    useEffect(() => {
        if (!id) {
            navigate(Constant.CONTENTS_BASE_PATH);
            return;
        }

        getContent(id);
    }, [id]);

    if (!content) {
        return <></>;
    }

    return (
        <Component.ContentsForm
            handleSubmit={handleSubmit}
            initialValues={content}
            selectedContentType={content?.contentType}
            formCrud={Crud?.contents?.edit}
            publicationStatusList={publicationStatusList}
        />
    );
};
