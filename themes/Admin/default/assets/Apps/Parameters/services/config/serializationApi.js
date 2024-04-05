import { Crud } from '@/AdminService/Crud';

export const serializationApi = {
    bool: (value) => (value ? 1 : 0),
    ImageFormat: (value) => value || '',
    int: (value) => (value || value === 0 ? value : '' || ''),
    list: (value) => value || '',
    multipleList: (value) => value || '',
    Page: (value) => value?.id || value || '',
    Room: (value) => value?.id || value || '',
    EventCategory: (value) => value?.id || value || '',
    MediaCategory: (value) => value?.id || value || '',
    Season: (value) => value?.id || value || '',
    string: (value) => value || '',
    upload: (value) => value || '',
    url: (value) => value || '',
    prices: (value) => (value ? JSON.stringify(value) : ''),
    password: (value) => value || '',
    requestButton: (value) => value || '',
    float: (value) => value || '',
};

export const getSerializationApiValue = (type, value) => {
    if (!Crud?.parameters?.edit?.serializationApi[type]) {
        return value || '';
    }

    console.log(type, value);
    return Crud?.parameters?.edit?.serializationApi[type](value);
};
