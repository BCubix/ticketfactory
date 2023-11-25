import { changeSlug } from '@Services/utils/changeSlug';
import { SeoInitialValues, SeoInitialFormInputs, SeoApiDataFields } from '@Apps/SEO/Form/SEOForm';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const seasonsInitialSchema = {
    name: (initValues) => initValues?.name || '',
    active: (initValues) => initValues?.active || false,
    beginYear: (initValues) => initValues?.beginYear || '',
    slug: (initValues) => initValues?.slug || '',
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    editSlug: false,
    seo: SeoInitialValues,
};

export const seasonsValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom de la saison.').max(250, 'Le nom renseigné est trop long.'),
    beginYear: Yup.number().required("Veuillez renseigner l'année de début.").min(1970, 'Veuillez renseigner une année valide.').max(2100, 'Veuillez renseigner une année valide.'),
};

export const seasonsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Saison activée ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            beginYear: { type: 'string' },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            seo: SeoApiDataFields,
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'season',
            label: 'Saison',
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
                            keyId: 'input-beginYear',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'beginYear',
                                label: 'Année de début',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
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
