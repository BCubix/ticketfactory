import notificationsApi from './services/api/notificationsApi';
import { NotificationsList } from './NotificationsList/NotificationsList';
import notificationsReducer from './redux/notifications/notificationsSlice';

import { setApi } from '@/AdminService/Api';
import { setCrud } from '@/AdminService/Crud';
import { setComponent } from '@/AdminService/Component';
import { setReducer } from '@/AdminService/Reducer';

export const initComponent = () => {
    setComponent('NotificationsList', NotificationsList);
};

export const initApi = () => {
    setApi('notificationsApi', notificationsApi);
};

export const initReducer = () => {
    setReducer('notifications', notificationsReducer);
};

export const initCrud = () => {
    const crud = {};

    setCrud('notifications', crud);
};
