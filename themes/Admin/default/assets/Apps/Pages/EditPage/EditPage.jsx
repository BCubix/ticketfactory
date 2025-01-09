import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { pagesInitialSchema, pagesValidationSchema, pagesForm } from '../PagesForm/PagesForm';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getPagesAction } from '@Apps/Pages/redux/pages/pagesSlice';

import { Crud } from '@/AdminService/Crud';
import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getUserRoles } from '@Services/utils/getUserRoles';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_PAGE_PUBLISH = 'ROLE_PAGE_PUBLISH';

export const pagesEditCrud = {
    form: {
        title: "Modification d'une page",
        initialSchema: pagesInitialSchema,
        validationSchema: pagesValidationSchema,
    },
    ...pagesForm,
};

export const EditPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(userProfileSelector);
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [pagesList, setPagesList] = useState(null);
    const [pageBlockTypesList, setPageBlockTypesList] = useState(null);

    const getPagesList = (langId) => {
        apiMiddleware(dispatch, async () => {
            const pages = await Api.pagesApi.getAllPages({ sort: 'title ASC', lang: langId });
            if (pages?.error) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPagesList(pages.pages);
        });
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

    const handleUpdateContent = async (pageId, id, values) => {
        values.page = pageId;

        if (id) {
            const result = await Api.contentsApi.editContent(id, values);
            if (!result.result) {
                return;
            }
        }

        NotificationManager.success('La page a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
        dispatch(getPagesAction());
        navigate(Constant.PAGES_BASE_PATH);
    };

    function handleSubmit(values) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.editPage(id, values);

            if (result.result) {
                handleUpdateContent(id, page?.contentId, values);
            }
        });
    }

    const publicationStatusList = useMemo(() => {
        if (checkUserAccess(getUserRoles(user), ROLE_PAGE_PUBLISH)) {
            return Crud.pages.edit.publicationStatusList;
        }

        return Crud.pages.edit.publicationStatusList?.filter((item) => item.value !== 'PUBLISHED');
    }, []);

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGES_BASE_PATH);
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.pagesApi.getOnePage(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGES_BASE_PATH);
                return;
            }

            setPage(result.page);
            getPagesList(result.page?.lang?.id);
        });
    }, [id]);

    useEffect(() => {
        apiMiddleware(dispatch, () => {
            getPageBlockTypesList();
        });
    }, []);

    if (!page || !pagesList) {
        return <></>;
    }

    return (
        <Component.PagesForm
            handleSubmit={handleSubmit}
            initialValues={page}
            contentType={page?.contentType}
            pagesList={pagesList}
            pageBlockTypesList={pageBlockTypesList}
            formCrud={Crud?.pages?.edit}
            publicationStatusList={publicationStatusList}
        />
    );
};
