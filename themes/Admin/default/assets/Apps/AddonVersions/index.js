import addonVersionsApi from './services/api/addonVersionsApi';
import addonVersionsReducer from './redux/addonVersions/addonVersionsSlice';

import { setApi } from '@/AdminService/Api';
import { setReducer } from '@/AdminService/Reducer';

export const initApi = () => {
    setApi('addonVersionsApi', addonVersionsApi);
};

export const initReducer = () => {
    setReducer('addonVersions', addonVersionsReducer);
};
