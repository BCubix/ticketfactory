import { changeSlug } from '@Services/utils/changeSlug';
import { SeoInitialValues, SeoInitialFormInputs, SeoApiDataFields } from '@Apps/SEO/Form/SEOForm';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const roomsInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    seatsNb: (initValues) => initValues?.seatsNb || '',
    area: (initValues) => initValues?.area || '',
    seatingPlans: (initValues) => (initValues?.seatingPlans ? initValues?.seatingPlans?.map((el) => ({ ...el, lang: el?.lang?.id || '' })) : []),
    slug: (initValues) => initValues?.slug || '',
    editSlug: false,
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    seo: SeoInitialValues,
};

export const roomsValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la salle.').max(250, 'Le nom renseigné est trop long.'),
    seatingPlans: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Veuillez renseigner le nom du plan'),
        })
    ),
};

export const roomsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Salle active ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            area: { type: 'string' },
            seatsNb: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            seatingPlans: {
                type: 'array',
                subFields: {
                    name: { type: 'string' },
                    lang: { type: 'string' },
                    languageGroup: { type: 'string' },
                },
            },
            seo: SeoApiDataFields,
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'room',
            label: 'Salle',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6, md: 4 },
                            inputs: [
                                {
                                    name: 'name',
                                    label: 'Nom',
                                    inputType: 'textField',
                                    required: true,
                                    sx: { marginBottom: 6 },
                                    custom: {
                                        handleChange:
                                            ({ values, editMode, setFieldValue }) =>
                                            (e) => {
                                                setFieldValue('name', e.target.value);
                                                if (!values.editSlug && !editMode) {
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
                        {
                            keyId: 'input-seatsNb',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'seatsNb',
                                label: 'Nombre de places',
                                inputType: 'textField',
                                type: 'number',
                                sx: { marginBottom: 6 },
                            },
                        },
                        {
                            keyId: 'input-area',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'area',
                                label: 'Superficie',
                                inputType: 'textField',
                                type: 'number',
                                sx: { marginBottom: 6 },
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Plans',
                    keyId: 'block-seating-plans',
                    fields: [
                        {
                            keyId: 'input-seating-plans',
                            style: { xs: 12 },
                            input: {
                                name: 'seatingPlans',
                                label: 'Plans',
                                inputType: 'fieldArray',
                                newObject: { name: '' },
                                fields: [
                                    {
                                        keyId: 'input-name',
                                        style: {
                                            xs: 12,
                                        },
                                        input: {
                                            name: 'name',
                                            label: 'Nom',
                                            inputType: 'textField',
                                            required: true,
                                            sx: { marginBottom: 6 },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                SeoInitialFormInputs,
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
