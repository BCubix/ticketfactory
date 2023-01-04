import authApi from '@Services/api/authApi';
import categoriesApi from '@Services/api/categoriesApi';
import config from '@Services/api/config';
import contactRequestsApi from '@Services/api/contactRequestsApi';
import contentTypesApi from '@Services/api/contentTypesApi';
import contentsApi from '@Services/api/contentsApi';
import dashboardApi from '@Services/api/dashboardApi';
import eventsApi from '@Services/api/eventsApi';
import imageFormatsApi from '@Services/api/imageFormatsApi';
import logsApi from '@Services/api/logsApi';
import languagesApi from '@Services/api/languagesApi';
import mediasApi from '@Services/api/mediasApi';
import menusApi from '@Services/api/menusApi';
import modulesApi from '@Services/api/modulesApi';
import pageBlocksApi from '@Services/api/pageBlocksApi';
import pagesApi from '@Services/api/pagesApi';
import pageHistoryApi from '@Services/api/pageHistoryApi';
import parametersApi from '@Services/api/parametersApi';
import profileApi from '@Services/api/profileApi';
import redirectionsApi from '@Services/api/redirectionsApi';
import roomsApi from '@Services/api/roomsApi';
import seasonsApi from '@Services/api/seasonsApi';
import tagsApi from '@Services/api/tagsApi';
import themesApi from '@Services/api/themesApi';
import usersApi from '@Services/api/usersApi';
import hooksApi from '@Services/api/hooksApi';
import { checkObject, checkString } from '@Services/utils/check';

const ApiObj = {
    authApi: authApi,
    categoriesApi: categoriesApi,
    config: config,
    contactRequestsApi: contactRequestsApi,
    contentTypesApi: contentTypesApi,
    contentsApi: contentsApi,
    dashboardApi: dashboardApi,
    eventsApi: eventsApi,
    imageFormatsApi: imageFormatsApi,
    logsApi: logsApi,
    languagesApi: languagesApi,
    mediasApi: mediasApi,
    menusApi: menusApi,
    modulesApi: modulesApi,
    pageBlocksApi: pageBlocksApi,
    pagesApi: pagesApi,
    pageHistoryApi: pageHistoryApi,
    parametersApi: parametersApi,
    profileApi: profileApi,
    redirectionsApi: redirectionsApi,
    roomsApi: roomsApi,
    seasonsApi: seasonsApi,
    tagsApi: tagsApi,
    themesApi: themesApi,
    usersApi: usersApi,
    hooksApi: hooksApi,
};

/**
 * Api's getter.
 */
export const Api = new Proxy(ApiObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Menu.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * Api's setter.
 *
 * @param  {string} name
 * @param  {object} api
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setApi(name, api) {
    checkString(name);
    checkObject(api);

    ApiObj[name] = api;
}
