import { changeSlug } from '@Services/utils/changeSlug';

const DATA_TYPE = {
    string: ({ values, key, field, formData, baseName }) => formData.append(getApiFieldName({ baseName, key, field }), values[key] || values[key] === 0 ? values[key] : ''),
    boolean: ({ values, key, field, formData, baseName }) => formData.append(getApiFieldName({ baseName, key, field }), values[key] ? 1 : 0),
    slug: ({ values, key, field, formData, baseName }) => formData.append(getApiFieldName({ baseName, key, field }), changeSlug(values[key] || '')),
    id: ({ values, formData, baseName, key, field }) => formData.append(getApiFieldName({ baseName, key, field }), values[key]?.id || ''),
    array: ({ values, key, field, baseName, ...props }) => {
        let maxIndex = 0;
        values[key]?.forEach((item) => {
            if (item?.index && item.index >= maxIndex) {
                maxIndex = item.index + 1;
            }
        });

        if (maxIndex === 0) {
            maxIndex = values[key]?.length || 0;
        }

        values[key]?.map((item) => {
            let index = item?.index || item?.index === 0 ? item?.index : maxIndex;
            constructFormData({ ...props, values: item, index, dataFields: field?.subFields, baseName: `${getApiFieldName({ baseName, key, field })}[${index}]` });

            if (!item?.index && item?.index !== 0) {
                maxIndex++;
            }
        });
    },
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
        } else {
            let func = field?.type ? DATA_TYPE[field.type] : null;

            if (func) {
                func({ key, values, field, dataFields, formData, ...props });
            }
        }
    });

    return formData;
};
