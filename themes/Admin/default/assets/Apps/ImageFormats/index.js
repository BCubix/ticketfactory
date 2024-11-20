import React from 'react';

import { CreateImageFormat, imageFormatsCreateCrud } from '@Apps/ImageFormats/CreateImageFormat/CreateImageFormat';
import { EditImageFormat, imageFormatsEditCrud } from '@Apps/ImageFormats/EditImageFormat/EditImageFormat';
import { ImageFormatsGenerateForm } from '@Apps/ImageFormats/ImageFormatsForm/ImageFormatsGenerateForm';
import { ImageFormatsParametersForm } from '@Apps/ImageFormats/ImageFormatsForm/ImageFormatsParametersForm';
import { ImageFormatGenerate } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatGenerate';
import { ImageFormatParameters } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatParameters';
import { ImageFormatsList, imageFormatsListCrud } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatsList';
import imageFormatsReducer from './redux/imageFormats/imageFormatSlice';
import imageFormatsApi from './services/api/imageFormatsApi';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';
import { setCrud } from '@/AdminService/Crud';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_IMAGE_FORMAT_READ';
const ROLE_CREATE = 'ROLE_IMAGE_FORMAT_CREATE';
const ROLE_EDIT = 'ROLE_IMAGE_FORMAT_EDIT';

export const initConstant = () => {
    setConstant('IMAGE_FORMATS_BASE_PATH', '/admin/image-formats');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('CreateImageFormat', CreateImageFormat);
    setComponent('EditImageFormat', EditImageFormat);
    setComponent('ImageFormatsGenerateForm', ImageFormatsGenerateForm);
    setComponent('ImageFormatsParametersForm', ImageFormatsParametersForm);
    setComponent('ImageFormatGenerate', ImageFormatGenerate);
    setComponent('ImageFormatParameters', ImageFormatParameters);
    setComponent('ImageFormatsList', ImageFormatsList);
};

export const initApi = () => {
    setApi('imageFormatsApi', imageFormatsApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.IMAGE_FORMATS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'mediasTabList',
        tabPathValue: Constant.IMAGE_FORMATS_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.IMAGE_FORMATS_BASE_PATH + Constant.CREATE_PATH, Component.CreateImageFormat);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.IMAGE_FORMATS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditImageFormat);
    }
};

export const initReducer = () => {
    setReducer('imageFormats', imageFormatsReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements(
        'mediasTabList',
        [
            {
                label: 'Emplacements de média',
                component: <Component.ImageFormatsList />,
                path: Constant.IMAGE_FORMATS_BASE_PATH,
            },
        ],
        3
    );
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: imageFormatsListCrud,
        add: imageFormatsCreateCrud,
        edit: imageFormatsEditCrud,
    };

    setCrud('imageFormats', crud);
};
