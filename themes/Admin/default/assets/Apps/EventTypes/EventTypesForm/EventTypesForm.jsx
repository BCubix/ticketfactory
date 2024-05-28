import { changeSlug } from '@Services/utils/changeSlug';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const eventTypesInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    slug: (initValues) => initValues?.slug || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    editSlug: false,
};

export const eventTypesValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du type.').max(250, 'Le nom renseigné est trop long.'),
};

export const eventTypesForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Type actif ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'eventType',
            label: "Type d'évènement",
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6 },
                            inputs: [
                                {
                                    name: 'name',
                                    label: 'Nom',
                                    inputType: 'textField',
                                    required: true,
                                    custom: {
                                        handleChange:
                                            ({ values, initialValues, setFieldValue }) =>
                                            (e) => {
                                                setFieldValue('name', e.target.value);
                                                if (!values.editSlug && !initialValues) {
                                                    setFieldValue('slug', changeSlug(e.target.value));
                                                }
                                            },
                                    },
                                },
                                {
                                    name: 'slug',
                                    inputType: 'slugInput',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
