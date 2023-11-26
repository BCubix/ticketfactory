import React from 'react';

import { DropzoneWrapper } from '@Apps/Medias/Components/DropzoneWrapper';
import { CreateMedia } from '@Apps/Medias/CreateMedia/CreateMedia';
import { EditMedia } from '@Apps/Medias/EditMedia/EditMedia';
import { ImageUploads } from '@Apps/Medias/ImageUploads/ImageUploads';
import { MediaDataForm } from '@Apps/Medias/MediasForm/MediaDataForm';
import { IframeMediaForm } from '@Apps/Medias/MediasForm/IframeMediaForm';
import { MediaImageForm } from '@Apps/Medias/MediasForm/MediaImageForm';
import { MediaParentCategoryPartForm } from '@Apps/Medias/MediasForm/MediaParentCategoryPartForm';
import { MediaParentFormatPartForm } from '@Apps/Medias/MediasForm/MediaParentFormatPartForm';
import { MediasFilters } from '@Apps/Medias/MediasList/MediasFilters/MediasFilters';
import { MediasSorters } from '@Apps/Medias/MediasList/MediasFilters/MediasSorters';
import { RotatingIcons } from '@Apps/Medias/MediasList/MediasFilters/sc.Filters';
import { MediasList, mediasListCrud } from '@Apps/Medias/MediasList/MediasList';
import { MediasMenu } from '@Apps/Medias/MediasMenu/MediasMenu';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import mediasReducer from './redux/medias/mediasSlice';
import mediasApi from './services/api/mediasApi';

import PermMediaIcon from '@mui/icons-material/PermMedia';

export const initConstant = () => {
    setConstant('MEDIAS_BASE_PATH', '/admin/medias');
};

export const initComponent = () => {
    setComponent('DropzoneWrapper', DropzoneWrapper);
    setComponent('CreateMedia', CreateMedia);
    setComponent('EditMedia', EditMedia);
    setComponent('ImageUploads', ImageUploads);
    setComponent('MediaDataForm', MediaDataForm);
    setComponent('IframeMediaForm', IframeMediaForm);
    setComponent('MediaImageForm', MediaImageForm);
    setComponent('MediaParentCategoryPartForm', MediaParentCategoryPartForm);
    setComponent('MediaParentFormatPartForm', MediaParentFormatPartForm);
    setComponent('MediasFilters', MediasFilters);
    setComponent('MediasSorters', MediasSorters);
    setComponent('RotatingIcons', RotatingIcons);
    setComponent('MediasList', MediasList);
    setComponent('MediasMenu', MediasMenu);
};

export const initApi = () => {
    setApi('mediasApi', mediasApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.MEDIAS_BASE_PATH, Component.MediasMenu, { tabValue: 0 });
};

export const initMenu = () => {
    insertSubMenu(4, 'PERSONNALISER', 'Bibliothèque médias', Constant.MEDIAS_BASE_PATH, <PermMediaIcon />, {
        relatedLinks: [Constant.MEDIA_CATEGORIES_BASE_PATH, Constant.IMAGE_FORMATS_BASE_PATH],
    });
};

export const initReducer = () => {
    setReducer('medias', mediasReducer);
};

export const initCrud = () => {
    const crud = {
        list: mediasListCrud,
    };

    setCrud('medias', crud);
};
