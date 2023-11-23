import React from 'react';

import { CreateImageFormat } from '@Apps/ImageFormats/CreateImageFormat/CreateImageFormat';
import { EditImageFormat } from '@Apps/ImageFormats/EditImageFormat/EditImageFormat';
import { ImageFormatsForm } from '@Apps/ImageFormats/ImageFormatsForm/ImageFormatsForm';
import { ImageFormatsGenerateForm } from '@Apps/ImageFormats/ImageFormatsForm/ImageFormatsGenerateForm';
import { ImageFormatsParametersForm } from '@Apps/ImageFormats/ImageFormatsForm/ImageFormatsParametersForm';
import { ImageFormatsFilters } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatsFilters/ImageFormatsFilters';
import { ImageFormatGenerate } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatGenerate';
import { ImageFormatParameters } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatParameters';
import { ImageFormatsList } from '@Apps/ImageFormats/ImageFormatsList/ImageFormatsList';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import imageFormatsReducer from './redux/imageFormats/imageFormatSlice';
import imageFormatsApi from './services/api/imageFormatsApi';

export const initConstant = () => {
    setConstant('IMAGE_FORMATS_BASE_PATH', '/admin/image-formats');
};

export const initComponent = () => {
    setComponent('CreateImageFormat', CreateImageFormat);
    setComponent('EditImageFormat', EditImageFormat);
    setComponent('ImageFormatsForm', ImageFormatsForm);
    setComponent('ImageFormatsGenerateForm', ImageFormatsGenerateForm);
    setComponent('ImageFormatsParametersForm', ImageFormatsParametersForm);
    setComponent('ImageFormatsFilters', ImageFormatsFilters);
    setComponent('ImageFormatGenerate', ImageFormatGenerate);
    setComponent('ImageFormatParameters', ImageFormatParameters);
    setComponent('ImageFormatsList', ImageFormatsList);
};

export const initApi = () => {
    setApi('imageFormatsApi', imageFormatsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.IMAGE_FORMATS_BASE_PATH, Component.MediasMenu, { tabValue: 2 });
    setAuthenticatedRoute(Constant.IMAGE_FORMATS_BASE_PATH + Constant.CREATE_PATH, Component.CreateImageFormat);
    setAuthenticatedRoute(`${Constant.IMAGE_FORMATS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditImageFormat);
};

export const initReducer = () => {
    setReducer('imageFormats', imageFormatsReducer);
};
