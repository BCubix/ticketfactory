import { changeSlug } from '@Services/utils/changeSlug';

const DATA_TYPE = {
    string: ({ values, key, field, formData, baseName }) => formData.append(getApiFieldName({ baseName, key, field }), values[key] || ''),
    boolean: ({ values, key, field, formData, baseName }) => formData.append(getApiFieldName({ baseName, key, field }), values[key] ? 1 : 0),
    slug: ({ values, key, field, formData, baseName }) => formData.append(getApiFieldName({ baseName, key, field }), changeSlug(values[key] || '')),
    id: ({ values, formData, baseName, key, field }) => formData.append(getApiFieldName({ baseName, key, field }), values[key]?.id || ''),
    array: ({ values, key, field, baseName, ...props }) =>
        values[key]?.map((item, index) => {
            constructFormData({ ...props, values: item, index, dataFields: field?.subFields, baseName: `${getApiFieldName({ baseName, key, field })}[${index}]` });
        }),
    object: ({ values, key, field, baseName, ...props }) =>
        constructFormData({ ...props, values: values[key], dataFields: field?.subFields, baseName: getApiFieldName({ baseName, key, field }) }),
};

export const getApiFieldName = ({ baseName = null, key, field }) => {
    let name = '';

    if (baseName) {
        name += `${baseName}[${field?.name ? field.name : key}]`;
    } else {
        name = field?.name ? field.name : key;
    }

    return name;
};

export const constructFormData = ({ values, dataFields, formData = null, ...props }) => {
    if (!formData) {
        formData = new FormData();
    }

    Object.entries(dataFields).map(([key, field]) => {
        if (field?.function) {
            field.function({ values, field, dataFields, key, formData, ...props });
        }

        let func = field?.type ? DATA_TYPE[field.type] : null;

        if (func) {
            func({ key, values, field, dataFields, formData, ...props });
        }
    });

    return formData;
};
