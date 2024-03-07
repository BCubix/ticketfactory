import React, { useMemo } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox, InputAdornment, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';

import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';

const VOUCHER_UNIT = [
    { label: 'Euros', value: '€' },
    { label: 'Pour cent', value: '%' },
];

export const vouchersInitialSchema = {
    name: (initValues) => initValues?.name || '',
    code: (initValues) => initValues?.code || '',
    discount: (initValues) => initValues?.discount || '',
    unit: (initValues) => initValues?.unit || '',
    beginDate: (initValues) => initValues?.beginDate || '',
    endDate: (initValues) => initValues?.endDate || '',
    active: (initValues) => initValues?.active || false,
    eventCategories: (initValues) => (initValues?.eventCategories ? initValues?.eventCategories?.map((el) => el.id) : []),
};

export const vouchersValidationSchema = {
    name: Yup.string().required('Veuillez renseigner un nom pour le bon'),
    code: Yup.string().required('Veuillez renseigner le code du bon.'),
    discount: Yup.number().required('Veuillez renseigner le montant de la réduction.'),
    unit: Yup.string().required("Veuillez choisir l'unité de la réduction."),
};

export const vouchersForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Coupon actif ?',
    },
    api: {
        dataFields: {
            name: { type: 'string' },
            code: { type: 'string' },
            discount: { type: 'string' },
            unit: { type: 'string' },
            beginDate: { type: 'string' },
            endDate: { type: 'string' },
            active: { type: 'boolean' },
            eventCategories: {
                function: ({ values, formData }) => {
                    values?.eventCategories.forEach((element, index) => {
                        formData.append(`eventCategories[${index}]`, element);
                    });
                },
            },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'voucher',
            label: 'Réduction',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 9 },
                            input: {
                                name: 'name',
                                label: 'Nom',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-code',
                            style: { xs: 12, sm: 3 },
                            component: ({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => {
                                const randomString = (len, charSet) => {
                                    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                    var randomString = '';
                                    for (var i = 0; i < len; i++) {
                                        var randomPoz = Math.floor(Math.random() * charSet.length);
                                        randomString += charSet.substring(randomPoz, randomPoz + 1);
                                    }
                                    return randomString;
                                };

                                return (
                                    <Component.CmtTextField
                                        value={values.code}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Code de réduction"
                                        name="code"
                                        error={touched.code && errors.code}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Component.ActionButton
                                                        size="small"
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={() => {
                                                            setFieldValue('code', randomString(6));
                                                        }}
                                                    >
                                                        Générer
                                                    </Component.ActionButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                );
                            },
                        },
                        {
                            keyId: 'input-discount',
                            style: { xs: 7, sm: 4 },
                            input: {
                                name: 'discount',
                                label: 'Montant de la réduction',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-unit',
                            style: { xs: 12, sm: 2 },
                            input: {
                                name: 'unit',
                                label: 'Unité de réduction',
                                inputType: 'selectField',
                                inputList: VOUCHER_UNIT,
                                listName: 'inputList',
                                getName: (item) => item.label,
                                getValue: (item) => item.value,
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-unit',
                            style: { xs: 12 },
                            component: ({ initialValues, values, eventCategoriesList, setFieldValue, touched, errors }) => {
                                const defaultExpend = useMemo(() => {
                                    let list = [];

                                    initialValues?.eventCategories?.forEach((el) => {
                                        list.push(...getDefaultParentPath(eventCategoriesList, el));
                                    });

                                    return list;
                                }, []);

                                return (
                                    <>
                                        <Box display="flex" justifyContent={'space-between'}>
                                            <Typography variant="body1" sx={{ mt: 2 }} className="required-input">
                                                Catégories d'évènements rattachées
                                            </Typography>
                                        </Box>
                                        <TreeView
                                            size="small"
                                            id="eventCategories"
                                            label="Catégories"
                                            defaultCollapseIcon={<ExpandMoreIcon />}
                                            defaultExpanded={[eventCategoriesList.id?.toString(), ...defaultExpend]}
                                            defaultExpandIcon={<ChevronRightIcon />}
                                            sx={{ flexGrow: 1, overflowY: 'auto' }}
                                        >
                                            {displayCategoriesOptions(eventCategoriesList, values, setFieldValue)}
                                        </TreeView>
                                        {touched?.eventCategories && errors?.eventCategories && (
                                            <Typography sx={{ fontSize: 12 }} color="error" id="eventCategories-helper-text">
                                                {touched?.eventCategories && errors?.eventCategories}
                                            </Typography>
                                        )}
                                    </>
                                );
                            },
                        },
                    ],
                },
                {
                    type: 'block',
                    title: 'Restrictions',
                    keyId: 'block-restrictions',
                    fields: [
                        {
                            keyId: 'input-beginDate',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'beginDate',
                                label: 'Date de début',
                                inputType: 'date',
                            },
                        },
                        {
                            keyId: 'input-endDate',
                            style: { xs: 12, sm: 6 },
                            input: {
                                name: 'endDate',
                                label: 'Date de fin',
                                inputType: 'date',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

const displayCategoriesOptions = (list, values, setFieldValue) => {
    if (!list || list?.length === 0) {
        return <></>;
    }

    const handleCheckCategory = (id) => {
        let categories = [...values?.eventCategories];
        const check = categories?.includes(id);

        if (check) {
            categories = categories?.filter((el) => el !== id);
            setFieldValue('eventCategories', categories);
        } else {
            categories.push(id);
            setFieldValue('eventCategories', categories);
        }
    };

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box display="flex" alignItems={'center'}>
                    <Checkbox
                        checked={values?.eventCategories?.includes(list.id)}
                        id={`eventCategoriesValue-${list.id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCheckCategory(list.id);
                        }}
                    />
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategoriesOptions(item, values, setFieldValue))}
        </TreeItem>
    );
};
