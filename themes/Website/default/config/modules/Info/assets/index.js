import React from 'react';
import moment from 'moment';

import InfoIcon from '@mui/icons-material/Info';
import { Typography } from "@mui/material";

import { setApi } from "@/AdminService/Api";
import { setAuthenticatedRoute } from "@/AdminService/AuthenticatedRoute";
import { Component, setComponent } from '@/AdminService/Component';
import { Constant, setConstant } from '@/AdminService/Constant';
import { insertSubMenu } from "@/AdminService/Menu";
import { setReducer } from "@/AdminService/Reducer";
import { setTableColumn } from "@/AdminService/TableColumn";

import infosApi from "./services/api/infosApi";
import infosReducer from './redux/infos/infosSlice';
import { InfosForm } from "./Apps/Infos/InfosForm";
import { InfosList } from "./Apps/Infos/InfosList/InfosList";
import { InfosFilters } from "./Apps/Infos/InfosList/InfosFilters/InfosFilters";
import { CreateInfo } from "./Apps/Infos/CreateInfo";
import { EditInfo } from "./Apps/Infos/EditInfo";

function active()
{
    setConstant('INFOS_BASE_PATH', '/admin/infos');

    setComponent('InfosList', InfosList);
    setComponent('InfosFilters', InfosFilters);
    setComponent('InfosForm', InfosForm);
    setComponent('CreateInfo', CreateInfo);
    setComponent('EditInfo', EditInfo);

    setTableColumn('InfosList', [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '30%', sortable: true },
        {
            name: 'beginDate',
            label: 'Date de début',
            width: '20%',
            sortable: true,
            renderFunction: (item) => {
                return (
                    <Typography component="p" variant="body1">
                        {item.beginDate && moment(item.beginDate).format('DD-MM-YYYY')}
                    </Typography>
                );
            },
        },
        {
            name: 'endDate',
            label: 'Date de fin',
            width: '20%',
            sortable: true,
            renderFunction: (item) => {
                return (
                    <Typography component="p" variant="body1">
                        {item.endDate && moment(item.endDate).format('DD-MM-YYYY')}
                    </Typography>
                );
            },
        },
    ]);

    insertSubMenu(2, 'PERSONNALISATION', 'Informations', Constant.INFOS_BASE_PATH, <InfoIcon />);

    setAuthenticatedRoute(Constant.INFOS_BASE_PATH, Component.InfosList);
    setAuthenticatedRoute(Constant.INFOS_BASE_PATH + Constant.CREATE_PATH, Component.CreateInfo);
    setAuthenticatedRoute(`${Constant.INFOS_BASE_PATH}/:id${Constant.EDIT_PATH}`, EditInfo);

    setReducer('infos', infosReducer);

    setApi('infosApi', infosApi);
}

export default active;