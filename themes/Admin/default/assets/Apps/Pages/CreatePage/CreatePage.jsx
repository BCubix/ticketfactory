import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getPagesAction } from '@Apps/Pages/redux/pages/pagesSlice';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';
import { pagesInitialSchema, pagesValidationSchema, pagesForm } from '../PagesForm/PagesForm';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getUserRoles } from '@Services/utils/getUserRoles';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_PAGE_PUBLISH = 'ROLE_PAGE_PUBLISH';

export const pagesCreateCrud = {
    form: {
        title: "Creation d'une page",
        initialSchema: pagesInitialSchema,
        validationSchema: pagesValidationSchema,
    },
    ...pagesForm,
};

export const CreatePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(userProfileSelector);
    const languagesData = useSelector(languagesSelector);
    const [initialValues, setInitialValues] = useState(null);
    const [pagesList, setPagesList] = useState(null);
    const [pageBlockTypesList, setPageBlockTypesList] = useState(null);

    const [queryParameters] = useSearchParams();
    const pageId = queryParameters.get('pageId');
    const languageId = queryParameters.get('languageId');

    const getPagesList = async (languageId) => {
        const result = await Api.pagesApi.getAllPages({ sort: 'title ASC', lang: languageId });
        if (!result?.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        setPagesList(result.pages);
    };

    const getPageBlockTypesList = async () => {
        const result = await Api.pageBlockTypesApi.getAllPageBlockTypes();
        if (!result?.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        setPageBlockTypesList(result.pageBlockTypes);
    };

    const getTranslated = async () => {
        if (!pageId || !languageId) {
            return;
        }

        let page = await Api.pagesApi.getTranslated(pageId, languageId);
        if (!page?.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        setInitialValues(page?.page);
    };

    const handleSubmit = (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.createPage(values);
            if (result?.result) {
                NotificationManager.success('La page a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPagesAction());
                navigate(Constant.PAGES_BASE_PATH);
            }
        });
    };

    const publicationStatusList = useMemo(() => {
        if (checkUserAccess(getUserRoles(user), ROLE_PAGE_PUBLISH)) {
            return Crud.pages.add.publicationStatusList;
        }

        return Crud.pages.add.publicationStatusList?.filter((item) => item.value !== 'PUBLISHED');
    }, []);

    useEffect(() => {
        if ((!languageId && !languagesData?.languages) || pagesList) {
            return;
        }

        const defaultLanguageId = languageId || languagesData?.languages?.find((el) => el.isDefault)?.id;

        apiMiddleware(dispatch, () => {
            getPagesList(defaultLanguageId);
        });
    }, [languagesData.languages]);

    useEffect(() => {
        apiMiddleware(dispatch, () => {
            getTranslated();
            getPageBlockTypesList();
        });
    }, []);

    return (
        <Component.PagesForm
            handleSubmit={handleSubmit}
            translateInitialValues={initialValues}
            pagesList={pagesList}
            pageBlockTypesList={pageBlockTypesList}
            formCrud={Crud?.pages?.add}
            publicationStatusList={publicationStatusList}
            formLoading={!pagesList || !pageBlockTypesList || (pageId && !initialValues)}
        />
    );
};
