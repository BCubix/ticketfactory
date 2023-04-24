import React from 'react';
import NewspaperIcon from '@mui/icons-material/Newspaper';

import { Component, setComponent } from "@/AdminService/Component";
import { Constant, setConstant } from "@/AdminService/Constant";

import { CreateNews } from "./Apps/News/CreateNews";
import { EditNews } from "./Apps/News/EditNews";
import { NewsForm } from "./Apps/News/NewsForm/NewsForm";
import { NewsBlocksForm } from "./Apps/News/NewsForm/NewsBlocksForm";
import { NewsMainMediaPartForm } from "./Apps/News/NewsForm/NewsMainMediaPartForm/NewsMainMediaPartForm";
import { NewsFilters } from "./Apps/News/NewsList/NewsFIlters/NewsFilters";
import { NewsList } from "./Apps/News/NewsList/NewsList";
import { DisplayNewsMediaInformations } from "./Apps/News/NewsForm/NewsMainMediaPartForm/DisplayNewsMediaInformations";

import newsesReducer from './redux/news/newsesSlice';
import newsesApi from "./services/api/newsesApi";

import { insertSubMenu } from "@/AdminService/Menu";
import { setTableColumn } from "@/AdminService/TableColumn";
import { setAuthenticatedRoute } from "@/AdminService/AuthenticatedRoute";
import { setReducer } from "@/AdminService/Reducer";
import { setApi } from "@/AdminService/Api";

function active() {
    setConstant('NEWS_BASE_PATH', '/admin/actualites');
    setComponent('NewsList', NewsList);
    setComponent('NewsForm', NewsForm);
    setComponent('CreateNews', CreateNews);
    setComponent('EditNews', EditNews);
    setComponent('NewsFilters', NewsFilters);
    setComponent('NewsBlocksForm', NewsBlocksForm);

    setComponent('DisplayNewsMediaInformations', DisplayNewsMediaInformations);
    setComponent('NewsMainMediaPartForm', NewsMainMediaPartForm);

    setTableColumn('NewsList', [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '50%', sortable: true },
        {
            name: 'homeDisplayed',
            label: "Affichée sur la page d'accueil ?",
            width: '20%',
            type: 'bool',
            sortable: true
        },
    ])

    insertSubMenu(10, 'PROGRAMMATION', 'Actualités',  Constant.NEWS_BASE_PATH,  <NewspaperIcon />);

    setAuthenticatedRoute(Constant.NEWS_BASE_PATH, Component.NewsList);
    setAuthenticatedRoute(Constant.NEWS_BASE_PATH + Constant.CREATE_PATH, Component.CreateNews);
    setAuthenticatedRoute(`${Constant.NEWS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditNews);

    setReducer('newses', newsesReducer);

    setApi('newsesApi', newsesApi);
}

export default active;