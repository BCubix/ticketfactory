import { Home } from '@Apps/Home/Home';
import { MainDashboard } from '@Apps/Home/MainDashboard';
import { HealthStats } from '@Apps/Home/HealthStats/HealthStats';
import { SalesStats} from '@Apps/Home/SalesStats/SalesStats';
import { Milestones } from '@Apps/Home/Milestones/Milestones';
import { DashboardCalendar } from '@Apps/Home/Calendar/DashboardCalendar';
import { UpdatesList } from '@Apps/Home/UpdatesList/UpdatesList';
import { GeneralInfos } from '@Apps/Home/GeneralInfos/GeneralInfos';
import { LatestOrderList } from '@Apps/Home/LatestOrderList/LatestOrderList';
import { GeneralStats } from '@Apps/Home/GeneralStats/GeneralStats';
import { ArticlesList } from '@Apps/Home/ArticlesList/ArticlesList';
import { NotesList } from '@Apps/Home/Notes/NotesList';
import { ToDoList } from '@Apps/Home/ToDoList/ToDoList';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import notesReducer from './Notes/redux/notesSlice';
import toDoTasksReducer from  './ToDoList/redux/toDoTasksSlice';
import generalStatsReducer from './GeneralStats/redux/generalStatsSlice';
import generalInfosReducer from './GeneralInfos/redux/generalInfosSlice';
import articlesReducer from './ArticlesList/redux/articlesSlice';
import healthStatsReducer from './HealthStats/redux/healthStats/healthStatsSlice';
import salesStatsReducer from './SalesStats/redux/salesStats/salesStatsSlice';
import milestonesReducer from './Milestones/redux/milestones/milestonesSlice';
import calendarReducer from './Calendar/redux/calendar/calendarSlice';

import notesApi from './Notes/services/api/notesApi';
import toDoTasksApi from './ToDoList/services/api/toDoTasksApi';
import generalStatsApi from './GeneralStats/services/api/generalStatsApi';
import generalInfosApi from './GeneralInfos/services/api/generalInfosApi';
import articlesApi from './ArticlesList/services/api/articlesApi';
import healthStatsApi from './HealthStats/services/api/healthStatsApi';
import salesStatsApi from './SalesStats/services/api/salesStatsApi';
import milestonesApi from './Milestones/services/api/milestonesApi';
import calendarApi from './Calendar/services/api/calendarApi';

export const initConstant = () => {
    setConstant('HOME_PATH', '/admin');
};

export const initComponent = () => {
    setComponent('Home', Home);
    setComponent('MainDashboard', MainDashboard);
    setComponent('HealthStats', HealthStats);
    setComponent('SalesStats', SalesStats);
    setComponent('Milestones', Milestones);
    setComponent('DashboardCalendar', DashboardCalendar);
    setComponent('UpdatesList', UpdatesList);
    setComponent('GeneralInfos', GeneralInfos);
    setComponent('LatestOrderList', LatestOrderList);
    setComponent('GeneralStats', GeneralStats);
    setComponent('ArticlesList', ArticlesList);
    setComponent('NotesList', NotesList);
    setComponent('ToDoList', ToDoList);
};

export const initApi = () => {
    setApi('notesApi', notesApi);
    setApi('toDoTasksApi', toDoTasksApi);
    setApi('generalStatsApi', generalStatsApi);
    setApi('generalInfosApi', generalInfosApi);
    setApi('articlesApi', articlesApi);
    setApi('healthStatsApi', healthStatsApi);
    setApi('salesStatsApi', salesStatsApi);
    setApi('milestonesApi', milestonesApi);
    setApi('calendarApi', calendarApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.HOME_PATH, Component.Home, { exact: true });
};

export const initReducer = () => {
    setReducer('notes', notesReducer);
    setReducer('toDoTasks', toDoTasksReducer);
    setReducer('generalStats', generalStatsReducer);
    setReducer('generalInfos', generalInfosReducer);
    setReducer('articles', articlesReducer);
    setReducer('healthStats', healthStatsReducer);
    setReducer('salesStats', salesStatsReducer);
    setReducer('milestones', milestonesReducer);
    setReducer('calendar', calendarReducer);
};
