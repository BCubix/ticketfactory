import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

export const orderStatusInitialSchema = {
    name: (initValues) => initValues?.name || '',
    keyword: (initValues) => initValues?.keyword || '',
    color: (initValues) => initValues?.color || '',
};

export const orderStatusValidationSchema = {
    name: Yup.string().required("Veuillez renseigner le nom l'état de la commande.").max(250, 'Le nom renseigné est trop long.'),
    color: Yup.string().required('Veuillez renseigner le code couleur.').max(250, 'Le nom renseigné est trop long.'),
};

export const orderStatusForm = {
    api: {
        dataFields: {
            name: { type: 'string' },
            keyword: { type: 'string' },
            color: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'orderStatus',
            label: 'Etat de la commande',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-color',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'color',
                                label: 'Couleur',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};
