import React, { useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Checkbox, Grid, InputAdornment, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import moment from 'moment';
import { TreeItem, TreeView } from '@mui/lab';
import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';

const VOUCHER_UNIT = [
    { label: 'Euros', value: '€' },
    { label: 'Pour cent', value: '%' },
];

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

export const VouchersForm = ({ handleSubmit, initialValues = null, eventCategoriesList = [] }) => {
    const defaultExpend = useMemo(() => {
        let list = [];

        initialValues?.eventCategories?.forEach((el) => {
            list.push(...getDefaultParentPath(eventCategoriesList, el));
        });

        return list;
    }, []);

    const voucherSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner un nom pour le bon'),
        code: Yup.string().required('Veuillez renseigner le code du bon.'),
        discount: Yup.number().required('Veuillez renseigner le montant de la réduction.'),
        unit: Yup.string().required("Veuillez choisir l'unité de la réduction."),
    });

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
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                code: initialValues?.code || '',
                discount: initialValues?.discount || '',
                unit: initialValues?.unit || '',
                beginDate: initialValues?.beginDate || '',
                endDate: initialValues?.endDate || '',
                active: initialValues?.active || false,
                eventCategories: initialValues?.eventCategories ? initialValues?.eventCategories?.map((el) => el.id) : [],
            }}
            validationSchema={voucherSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, setFieldValue, setFieldTouched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper title={`${initialValues ? 'Modification' : 'Création'} d'un coupon de réduction`} component="form" onSubmit={handleSubmit}>
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={9} sm={9}>
                                <Component.CmtTextField
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Nom"
                                    name="name"
                                    error={touched.name && errors.name}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
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
                            </Grid>
                            <Grid item xs={7} sm={4}>
                                <Component.CmtTextField
                                    value={values.discount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Montant de la réduction"
                                    name="discount"
                                    error={touched.discount && errors.discount}
                                    type="number"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Component.CmtSelectField
                                    label="Unité de réduction"
                                    required
                                    name={`unit`}
                                    value={values.unit}
                                    list={VOUCHER_UNIT}
                                    getValue={(item) => item.value}
                                    getName={(item) => item.label}
                                    setFieldValue={setFieldValue}
                                    errors={touched.unit && errors.unit}
                                    handleBlur={handleBlur}
                                />
                            </Grid>

                            <Grid item xs={12}>
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
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title={'Restrictions'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ paddingTop: 3 }}>
                                    <Component.CmtDatePicker
                                        fullWidth
                                        value={values.beginDate}
                                        setValue={(newValue) => {
                                            setFieldValue(`beginDate`, moment(newValue).format('YYYY-MM-DD'));
                                        }}
                                        onTouched={setFieldTouched}
                                        name={`beginDate`}
                                        error={errors?.beginDate}
                                        label={'Date de début'}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ paddingTop: 3 }}>
                                    <Component.CmtDatePicker
                                        fullWidth
                                        value={values.endDate}
                                        setValue={(newValue) => {
                                            setFieldValue(`endDate`, moment(newValue).format('YYYY-MM-DD'));
                                        }}
                                        onTouched={setFieldTouched}
                                        name={`endDate`}
                                        error={errors?.endDate}
                                        label={'Date de fin'}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Coupon actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            Modifier
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
