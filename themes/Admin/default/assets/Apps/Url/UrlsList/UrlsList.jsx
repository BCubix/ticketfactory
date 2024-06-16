import React, { useMemo } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';

import { changeUrlFilters, getUrlAction, setUrl, urlSelector } from '@Apps/Url/redux/url/urlSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { copyData } from '@Services/utils/copyData';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const urlListCrud = {
    title: 'Url',
    listTitle: 'Liste des url',
    filtersData: [{ key: 'active', type: 'boolean' }, 'name'],
    filterList: [
        { key: 'active', title: 'Chercher par status', label: 'Actif ?', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    tableList: [
        { name: 'id', label: 'ID', width: '5%', sortable: false },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: false },
        { name: 'name', label: 'Nom', width: '15%', sortable: false },
        { name: 'page.slug', label: 'Page', width: '20%', sortable: false },
        { name: 'slug', label: 'PermaLink', width: '20%', sortable: false },
    ],
    parameterList: ['core_index_site', 'core_generate_seo', 'core_use_ssl', 'core_use_cache'],
    loadDataAction: () => getUrlAction(),
    changeFiltersActions: (props, page) => changeUrlFilters(props, page),
    dataSelector: urlSelector,
    dataList: (selector) => selector.url,
    links: {
        edit: (id) => `${Constant.URL_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    bottomComponents: [{ component: () => <Component.UrlParameters /> }],
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const UrlList = ({ listCrud = Crud.url.list }) => {
    const objectData = useSelector(listCrud.dataSelector);
    const dispatch = useDispatch();

    const isFiltered = useMemo(() => {
        let filtered = false;

        Object.keys(objectData.filters).forEach((key) => {
            if (objectData.filters[key]) {
                filtered = true;
            }
        });

        return filtered;
    }, [objectData.filters]);

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        let indexSrc = result.source.index;
        let indexDest = result.destination.index;

        if (indexSrc === indexDest) {
            return;
        }

        let svList = Object.values(copyData(listCrud?.dataList(objectData)));

        const removedElement = svList.splice(indexSrc, 1)[0];
        svList.splice(indexDest, 0, removedElement);

        dispatch(setUrl({ url: svList }));

        apiMiddleware(dispatch, async () => {
            const result = await Api.urlApi.orderUrl(removedElement.id, indexSrc, indexDest);
            if (result?.result) {
                NotificationManager.success("L'url a bien changé de position.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getUrlAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    return <Component.CmtCrudList listCrud={listCrud} onDragEnd={isFiltered ? null : handleDragEnd} />;
};
