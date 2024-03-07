import { Crud } from '@/AdminService/Crud';

export const deserializationApi = {
    bool: (value) => value,
    ImageFormat: (value) => value || '',
    int: (value) => (value ? value : value === 0 ? 0 : ''),
    list: (value) => value || '',
    multipleList: (value) => value || '',
    Page: (value) => value?.id || value || '',
    Room: (value) => value?.id || value || '',
    Season: (value) => value?.id || value || '',
    string: (value) => value || '',
    upload: (value) => value || '',
    url: (value) => value || '',
    prices: (value) => (value ? JSON.parse(value) : {}),
    password: (value) => value || '',
    requestButton: (value) => value || '',
};

export const getDeserializationApiValue = (type, value) => {
    if (!Crud?.parameters?.edit?.deserializationApi[type]) {
        return '';
    }

    return Crud?.parameters?.edit?.deserializationApi[type](value);
};
