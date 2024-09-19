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
    font: (value) => value || '',
    openingHours: (value) => (value ? JSON.stringify(value) : ''),
};

export const getSerializationApiValue = (parameter) => {
    if (parameter.translatedParameter) {
        if (!parameter.paramValue) {
            return JSON.stringify({}) || '';
        }

        let result = {};
        Object.entries(parameter.paramValue)?.forEach(([key, value]) => {
            if (!Crud?.parameters?.edit?.serializationApi[parameter.type]) {
                result[key] = value || '';
            } else {
                result[key] = Crud?.parameters?.edit?.serializationApi[parameter.type](value);
            }
        });

        return JSON.stringify(result) || '';
    }

    if (!Crud?.parameters?.edit?.serializationApi[parameter.type]) {
        return parameter.paramValue || '';
    }

    return Crud?.parameters?.edit?.serializationApi[parameter.type](parameter.paramValue);
};
