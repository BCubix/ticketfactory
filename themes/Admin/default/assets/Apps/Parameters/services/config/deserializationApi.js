import { Crud } from '@/AdminService/Crud';

export const deserializationApi = {
    bool: (value) => value,
    ImageFormat: (value) => value || '',
    int: (value) => (value ? value : value === 0 ? 0 : ''),
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
    prices: (value) => value || {},
    password: (value) => value || '',
    requestButton: (value) => value || '',
    float: (value) => value || '',
    font: (value) => value || '',
    openingHours: (value) => value || { lundi: '', mardi: '', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: '' },
};

export const getDeserializationApiValue = (parameter) => {
    if (parameter.translatedParameter) {
        if (!parameter.paramValue) {
            return {};
        }

        let result = {};
        Object.entries(parameter.paramValue).forEach(([key, value]) => {
            if (!Crud?.parameters?.edit?.deserializationApi[parameter.type]) {
                result[key] = '';
            }

            result[key] = Crud?.parameters?.edit?.deserializationApi[parameter.type](value);
        });

        return result;
    }

    if (!Crud?.parameters?.edit?.deserializationApi[parameter.type]) {
        return '';
    }

    return Crud?.parameters?.edit?.deserializationApi[parameter.type](parameter.paramValue);
};
