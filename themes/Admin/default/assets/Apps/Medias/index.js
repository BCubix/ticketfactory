import React from 'react';
import PermMediaIcon from '@mui/icons-material/PermMedia';

import { DropzoneWrapper } from '@Apps/Medias/Components/DropzoneWrapper';
import { CreateMedia } from '@Apps/Medias/CreateMedia/CreateMedia';
import { EditMedia } from '@Apps/Medias/EditMedia/EditMedia';
import { ImageUploads } from '@Apps/Medias/ImageUploads/ImageUploads';
import { MediaDataForm } from '@Apps/Medias/MediasForm/MediaDataForm';
import { IframeMediaForm } from '@Apps/Medias/MediasForm/IframeMediaForm';
import { MediaImageForm } from '@Apps/Medias/MediasForm/MediaImageForm';
import { MediaParentCategoryPartForm } from '@Apps/Medias/MediasForm/MediaParentCategoryPartForm';
import { MediaParentFormatPartForm } from '@Apps/Medias/MediasForm/MediaParentFormatPartForm';
import { MediasSorters } from '@Apps/Medias/MediasList/MediasFilters/MediasSorters';
import { MediasFilters } from '@Apps/Medias/MediasList/MediasFilters/MediasFilters';
import { RotatingIcons } from '@Apps/Medias/MediasList/MediasFilters/sc.Filters';
import { MediasList, mediasListCrud } from '@Apps/Medias/MediasList/MediasList';
import { MediasMenu } from '@Apps/Medias/MediasMenu/MediasMenu';
import mediasReducer from './redux/medias/mediasSlice';
import mediasApi from './services/api/mediasApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('MEDIAS_BASE_PATH', '/admin/medias');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_READ')) {
        return;
    }

    setComponent('DropzoneWrapper', DropzoneWrapper);
    setComponent('CreateMedia', CreateMedia);
    setComponent('EditMedia', EditMedia);
    setComponent('ImageUploads', ImageUploads);
    setComponent('MediaDataForm', MediaDataForm);
    setComponent('IframeMediaForm', IframeMediaForm);
    setComponent('MediaImageForm', MediaImageForm);
    setComponent('MediaParentCategoryPartForm', MediaParentCategoryPartForm);
    setComponent('MediaParentFormatPartForm', MediaParentFormatPartForm);
    setComponent('MediasSorters', MediasSorters);
    setComponent('RotatingIcons', RotatingIcons);
    setComponent('MediasList', MediasList);
    setComponent('MediasMenu', MediasMenu);
    setComponent('MediasFilters', MediasFilters);
};

export const initApi = () => {
    setApi('mediasApi', mediasApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.MEDIAS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'mediasTabList',
        tabPathValue: Constant.MEDIAS_BASE_PATH,
    });
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_READ')) {
        return;
    }

    insertSubMenu(4, 'PERSONNALISER', 'Médias', Constant.MEDIAS_BASE_PATH, <PermMediaIcon />, {
        relatedLinks: [Constant.MEDIA_CATEGORIES_BASE_PATH, Constant.IMAGE_FORMATS_BASE_PATH],
    });
};

export const initReducer = () => {
    setReducer('medias', mediasReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_READ')) {
        return;
    }

    addTabElements('mediasTabList', [{ label: 'Médias', component: <Component.MediasList />, path: Constant.MEDIAS_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MEDIA_READ')) {
        return;
    }

    const crud = {
        list: mediasListCrud,
    };

    setCrud('medias', crud);
};
