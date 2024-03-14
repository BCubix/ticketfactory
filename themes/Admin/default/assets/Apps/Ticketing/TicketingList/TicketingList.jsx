import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Avatar, Typography, IconButton } from '@mui/material';

import { changeTicketingFilters, getTicketingAction, ticketingSelector } from '@Apps/Ticketing/redux/ticketing/ticketingSlice';
import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { useDispatch } from 'react-redux';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useTheme } from '@emotion/react';

export const ticketingListCrud = {
    title: 'Billetteries',
    listTitle: 'Liste des billetteries',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'name',
        'page',
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
        { key: 'active', title: 'Chercher par status', label: 'Actif ?', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
    ],
    loadDataAction: () => getTicketingAction(),
    changeFiltersActions: (props, page) => changeTicketingFilters(props, page),
    dataSelector: ticketingSelector,
    dataList: (selector) => selector.ticketing,
    new: ({ setCreateDialog }) => setCreateDialog(true),
    delete: (props) => Api.ticketingApi.deleteTicketing(props),
    links: {
        new: () => `${Constant.TICKETING_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.TICKETING_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.TICKETING_BASE_PATH}${Constant.CREATE_PATH}?roomId=${id}&languageId=${languageId}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette billetterie ?',
    },
    wrapperComponent: DEFAULT_CRUD_LIST_COMPONENTS?.wrapperComponent,
    components: [{ component: (props) => <DisplayTicketingList {...props} /> }, { component: (props) => <CreateNewTicketingDialog {...props} /> }],
};

const CreateNewTicketingDialog = ({ createDialog, setCreateDialog, modules, ticketingValue, setTicketingValue, navigate }) => {
    return (
        <Dialog
            open={createDialog}
            onClose={() => {
                setCreateDialog(false);
                setTicketingValue('');
            }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ fontSize: 20 }}>Créer une billetterie</DialogTitle>
            <DialogContent dividers>
                <Component.CmtSelect
                    label="Billetterie"
                    value={ticketingValue}
                    list={modules}
                    getValue={(item) => item.id}
                    getName={(item) => item.name}
                    onChange={(e) => setTicketingValue(e.target.value)}
                    emptyLabel="Billetterie libre"
                />
            </DialogContent>

            <DialogActions>
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                        color="error"
                        onClick={() => {
                            setCreateDialog(false);
                            setTicketingValue('');
                        }}
                        id="cancelDialog"
                    >
                        Annuler
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            console.log(ticketingValue);
                            navigate(`${Constant.TICKETING_BASE_PATH}${Constant.CREATE_PATH}${ticketingValue ? `?ticketingId=${ticketingValue}` : ''}`);
                        }}
                        id="validateDialog"
                    >
                        Suivant
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

const DisplayTicketingList = ({ objectData, listCrud, navigate, setDeleteDialog }) => {
    const theme = useTheme();

    return (
        <Grid container spacing={4}>
            {listCrud?.dataList(objectData)?.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                    <Component.CmtCard sx={{ border: '1px solid #dadada' }}>
                        <Box sx={{ display: 'flex', padding: 3 }}>
                            <Avatar src={`/admin/api/modules/moduleImage/${item?.module?.name}`} />
                            <Box pl={4}>
                                <Typography variant="h3">{item?.name}</Typography>
                                <Typography variant="h4">{item?.module?.name ? `Module ${item?.module?.name}` : 'Aucun module'}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 3 }}>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                sx={{ marginLeft: 3, color: theme.palette.crud.update.textColor }}
                                onClick={() => (listCrud?.links?.edit ? navigate(listCrud?.links?.edit(item?.id)) : null)}
                            >
                                <EditIcon fontSize="inherit" />
                            </IconButton>

                            <IconButton aria-label="delete" color="error" size="small" sx={{ marginLeft: 3 }} onClick={() => (listCrud?.delete ? setDeleteDialog(item?.id) : null)}>
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </Box>
                    </Component.CmtCard>
                </Grid>
            ))}
        </Grid>
    );
};

export const TicketingList = () => {
    const dispatch = useDispatch();
    const [modules, setModules] = useState([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [ticketingValue, setTicketingValue] = useState('');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.modulesApi.getAllModules({ active: true });
            if (result?.result) {
                setModules(result?.modules?.filter((it) => it.category === 'ticketing'));
            }
        });
    }, []);

    return (
        <Component.CmtCrudList
            listCrud={Crud?.ticketing?.list}
            modules={modules}
            createDialog={createDialog}
            setCreateDialog={setCreateDialog}
            ticketingValue={ticketingValue}
            setTicketingValue={setTicketingValue}
        />
    );
};
