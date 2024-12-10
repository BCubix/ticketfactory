import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Skeleton,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud, setCrud } from '@/AdminService/Crud';
import { DEFAULT_CONTENT_CRUD_LIST_COMPONENTS } from '@Apps/Contents/ContentsList/ContentCrudList';

import { changeContentsFilters, contentsSelector, getAllContentDataAction, getContentsAction, setContentTypeKey } from '@Apps/Contents/redux/contents/contentsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const contentsListCrud = {
    title: 'Contenus',
    listTitle: 'Liste des contenus',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'title',
        {
            key: 'contentType',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[contentType][${index}]`] = el;
                });
            },
        },
        'page',
        'lang',
        'limit',
        {
            key: 'sort',
            transformFilter: (params, sort) => {
                const splitSort = sort?.split(' ');

                params['filters[sortField]'] = splitSort[0];
                params['filters[sortOrder]'] = splitSort[1];
            },
        },
    ],
    filterList: [
        { key: 'active', title: 'Chercher par status', label: 'Actif', type: 'boolean' },
        { key: 'title', title: 'Chercher par titre', label: 'Titre', type: 'search' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '20%', sortable: true },
        { name: 'contentType.name', label: 'Type de contenu', width: '30%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    contentTypes: {},
    loadDataAction: (contentTypeKey, filters) => getContentsAction(contentTypeKey, filters),
    changeFiltersActions: (objectData, props, page) => changeContentsFilters(objectData, props, page),
    dataSelector: contentsSelector,
    dataList: (selector) => selector.contents,
    duplicate: (props) => Api.contentsApi.duplicateContent(props),
    delete: (props) => Api.contentsApi.deleteContent(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_CONTENT_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_CONTENT_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_CONTENT_DELETE'),
    },
    links: {
        edit: (id) => `${Constant.CONTENTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.CONTENTS_BASE_PATH}${Constant.CREATE_PATH}?contentId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'Le contenu a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce contenu ?',
    },
    wrapperComponent: DEFAULT_CONTENT_CRUD_LIST_COMPONENTS?.wrapperComponent,
    components: [...DEFAULT_CONTENT_CRUD_LIST_COMPONENTS?.components],
};

export const ContentsList = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { contentData, contentDataLoading, contentDataError, contentTypeKey } = useSelector(contentsSelector);
    const [loaded, setLoaded] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= theme.breakpoints.values.md);

    useEffect(() => {
        console.log('ok');
        if (!contentData && !contentDataLoading && !contentDataError) {
            dispatch(getAllContentDataAction());
            return;
        }

        if (!contentData || contentDataLoading || contentDataError) {
            return;
        }

        let moduleTypes = {};
        Object.entries(Crud.contents.list.contentTypes)?.forEach(([key, value]) => {
            if (!value?.contentType || value?.contentType !== 'contentType') {
                moduleTypes[key] = value;
            }
        });

        let newContentTypes = {};
        Object.entries(contentData)?.forEach(([key, value]) => {
            let newItem = {
                label: value?.contentType?.name,
                type: 'contentType',
            };

            newContentTypes[key] = newItem;
        });

        newContentTypes = {
            ...newContentTypes,
            ...moduleTypes,
        };

        let crud = Crud.contents;
        crud.list.contentTypes = newContentTypes;

        if (!contentTypeKey) {
            let keys = Object.keys(newContentTypes);
            if (keys.length > 0) {
                dispatch(setContentTypeKey({ contentTypeKey: keys[0] }));
            }
        }

        setCrud('contents', crud);
        setLoaded(true);
    }, [contentData, contentDataLoading, contentDataError]);

    const contentMargin = useMemo(() => {
        return sidebarOpen ? 200 : 0;
    }, [sidebarOpen]);

    const getContentTypeItem = useMemo(() => {
        return Crud.contents.list.contentTypes[contentTypeKey] || null;
    }, [Crud.contents.list.contentTypes, contentTypeKey]);

    if (!loaded) {
        return (
            <>
                <Box marginRight={`${contentMargin}px`} padding={8} height="100%">
                    <Skeleton variant="rounded" height="40px" width="30%" />
                    <Skeleton variant="rounded" height="90%" width="100%" sx={{ marginTop: 4 }} />
                </Box>
                {sidebarOpen && (
                    <Box position="absolute" right={0} top={`${theme.layout.header.height}px`} bottom={0} width={contentMargin}>
                        <Skeleton variant="rectangular" height="100%" width="100%" />
                    </Box>
                )}
            </>
        );
    }

    return (
        <>
            <Box marginRight={{ xs: 0, md: `${contentMargin}px` }}>
                {getContentTypeItem && getContentTypeItem?.component && <getContentTypeItem.component />}
                {getContentTypeItem && getContentTypeItem?.type === 'contentType' && !getContentTypeItem?.component && (
                    <Box>
                        <IconButton
                            edge="start"
                            color="primary"
                            aria-label="open right drawer"
                            sx={{
                                position: 'absolute',
                                top: `${theme.layout.header.height}px`,
                                right: 0,
                                zIndex: 3,
                                margin: 2,
                            }}
                            onClick={() => {
                                setSidebarOpen(!sidebarOpen);
                            }}
                        >
                            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                        </IconButton>

                        <Component.ContentCrudList
                            listCrud={{
                                ...Crud?.contents?.list,
                                dataList: () => contentData[contentTypeKey]?.contents,
                                links: {
                                    ...Crud?.contents?.list.links,
                                    new: () => `${Constant.CONTENTS_BASE_PATH}${Constant.CREATE_PATH}?contentType=${contentData[contentTypeKey]?.contentType?.id}`,
                                },
                            }}
                            objectData={contentData[contentTypeKey] || {}}
                            contentTypeKey={contentTypeKey}
                        />
                    </Box>
                )}
            </Box>

            <Drawer
                sx={{
                    '& .MuiDrawer-paper': {
                        border: 'none',
                        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.085)',
                        transition: (theme) => theme.transitions.create(['width']),
                        width: contentMargin,
                        overflow: 'hidden',
                        paddingRight: 0,
                        height: `calc(100% - ${theme.layout.header.height}px)`,
                        marginTop: `${theme.layout.header.height}px`,
                    },
                    zIndex: 2,
                }}
                anchor="right"
                variant="permanent"
                open={sidebarOpen}
                transitionDuration={300}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <Box sx={{ overflow: 'auto', height: '100%' }}>
                    <List disablePadding sx={{ pb: 2 }}>
                        <Component.MenuTitle component="li" disableSticky>
                            <Typography variant="h2" fontSize={12}>
                                Types de contenus
                            </Typography>
                        </Component.MenuTitle>

                        {Object.entries(Crud.contents.list.contentTypes)
                            ?.sort((a, b) => a[1].label > b[1].label)
                            ?.map(([key, value], index) => (
                                <Component.ContentMenuButton component="li" key={index} isActive={contentTypeKey === key}>
                                    <ListItemText
                                        onClick={() => dispatch(setContentTypeKey({ contentTypeKey: key }))}
                                        primary={value.label}
                                        sx={{
                                            pl: 7,
                                            pr: 3,
                                            py: 2,
                                            m: 0,
                                            '& .MuiTypography-root': {
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            },
                                        }}
                                    />
                                </Component.ContentMenuButton>
                            ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
