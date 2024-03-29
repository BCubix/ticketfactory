import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { changeSlug } from '@Services/utils/changeSlug';

import { Constant } from '@/AdminService/Constant';
import { copyData } from '@Services/utils/copyData';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { getSeoFormData } from './seoApi';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'title', sortName: 'filters[title]' },
    { name: 'page', sortName: 'filters[page]' },
    { name: 'limit', sortName: 'filters[limit]' },
    { name: 'lang', sortName: 'filters[lang]' },
    {
        name: 'sort',
        transformFilter: (params, sort) => {
            const splitSort = sort?.split(' ');

            params['filters[sortField]'] = splitSort[0];
            params['filters[sortOrder]'] = splitSort[1];
        },
    },
];

const getFormData = (data) => {
    let formData = new FormData();

    formData.append('active', data.active ? 1 : 0);
    formData.append('title', data.title);
    formData.append('parent', data.parent);
    formData.append('subtitle', data.subtitle);
    formData.append('slug', changeSlug(data.slug));
    formData.append('lang', data.lang);
    formData.append('languageGroup', data.languageGroup);

    data.pageBlocks.forEach((block, index) => {
        formData.append(`pageBlocks[${index}][name]`, block.name);
        formData.append(`pageBlocks[${index}][saveAsModel]`, block.saveAsModel ? 1 : 0);
        formData.append(`pageBlocks[${index}][lang]`, block.lang || '');
        formData.append(`pageBlocks[${index}][languageGroup]`, block.languageGroup || '');
        formData.append(`pageBlocks[${index}][blockType]`, block.blockType || 0);

        block.columns.forEach((column, columnIndex) => {
            formData.append(`pageBlocks[${index}][columns][${columnIndex}][content]`, block?.blockType === 1 ? column?.content?.id || '' : column.content || '');
            formData.append(`pageBlocks[${index}][columns][${columnIndex}][xs]`, column.xs);
            formData.append(`pageBlocks[${index}][columns][${columnIndex}][s]`, column.s);
            formData.append(`pageBlocks[${index}][columns][${columnIndex}][m]`, column.m);
            formData.append(`pageBlocks[${index}][columns][${columnIndex}][l]`, column.l);
            formData.append(`pageBlocks[${index}][columns][${columnIndex}][xl]`, column.xl);
        });
    });

    getSeoFormData(formData, data);

    return formData;
};

const pagesApi = {
    getPages: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/pages', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, pages: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, pages: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllPages: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);
            if (filters?.lang) {
                params['filters[lang]'] = filters?.lang;
            }

            const result = await axios.get('/pages', { params: params });

            return { result: true, pages: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOnePage: async (id) => {
        try {
            const result = await axios.get(`/pages/${id}`);

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createPage: async (data) => {
        try {
            const result = await axios.post('/pages', getFormData(data));

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editPage: async (id, data) => {
        try {
            const result = await axios.post(`/pages/${id}`, getFormData(data));

            return { result: true, page: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deletePage: async (id) => {
        try {
            await axios.delete(`/pages/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicatePage: async (id) => {
        try {
            await axios.post(`/pages/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/pages/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, page: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pagesApi;
