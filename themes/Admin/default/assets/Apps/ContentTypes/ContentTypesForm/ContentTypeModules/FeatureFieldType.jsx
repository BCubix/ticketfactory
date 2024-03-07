import React, { useEffect, useState } from 'react';
import { FormControlLabel, FormHelperText, Grid, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

const NAME = 'Feature';
const LABEL = 'Attributs';

const TYPE = 'feature';
const TYPE_GROUP_NAME = 'Liens';

const ComplementInformation = ({ values, index, setFieldValue, handleBlur, prefixName, errors, touched }) => {
    const dispatch = useDispatch();
    const languagesData = useSelector(languagesSelector);
    const [features, setFeatures] = useState([]);
    const [featureCategories, setFeatureCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (!languagesData?.languages || (features?.length > 0 && featureCategories?.length > 0)) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const defaultLanguageId = languagesData?.languages?.find((el) => el.isDefault)?.id;

            Api.featuresApi.getAllFeatures({ lang: defaultLanguageId }).then((result) => setFeatures(result.features));
            Api.featureCategoriesApi.getAllFeatureCategories({ lang: defaultLanguageId }).then((result) => setFeatureCategories(result.featureCategories));
        });
    }, [languagesData]);

    useEffect(() => {
        if (!features || !featureCategories || selectedCategory || !values.parameters.feature) {
            return;
        }

        const fCategory = features?.find((item) => item?.id?.toString() === values?.parameters?.feature)?.featureCategory?.id;
        if (fCategory) {
            setSelectedCategory(fCategory?.toString());
        }
    }, [features, featureCategories]);

    return (
        <>
            <Box marginTop={8} marginLeft={4} marginBottom={4}>
                <Typography variant="body1" sx={{ marginTop: 5 }}>
                    Définir un attribut
                </Typography>
                <Grid container spacing={12}>
                    <Grid item xs={12} sm={6}>
                        <Component.CmtSelect
                            label="Catégorie d'attribut"
                            value={selectedCategory || ''}
                            list={featureCategories}
                            getValue={(item) => item.id}
                            getName={(item) => item.name}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.parameters.feature`, '');
                                setSelectedCategory(e.target.value);
                            }}
                            emptyLabel={''}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Component.CmtSelect
                            label="Attribut"
                            name={`${prefixName}fields.${index}.parameters.feature`}
                            value={values.parameters.feature}
                            list={features.filter((item) => item.featureCategory?.id?.toString() === selectedCategory?.toString())}
                            getValue={(item) => item.id?.toString()}
                            getName={(item) => item.name}
                            setFieldValue={setFieldValue}
                            emptyLabel={''}
                            disabled={!Boolean(selectedCategory)}
                        />
                    </Grid>
                </Grid>
            </Box>

            <FormHelperText error>{getNestedFormikError(touched?.fields, errors?.fields, index, 'parameters')?.feature}</FormHelperText>
        </>
    );
};

const Options = ({ values, index, setFieldValue, prefixName, handleChange }) => {
    return (
        <>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.required)}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.options.required`, e.target.checked);
                            }}
                        />
                    }
                    label={'Requis'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.disabled)}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.options.disabled`, e.target.checked);
                            }}
                        />
                    }
                    label={'Désactivé'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
        </>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [{ label: 'Options', component: (props) => <Options {...props} /> }];

const setInitialValues = (prefixName, setFieldValue) => {
    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
    setFieldValue(`${prefixName}.parameters`, getInitialValues().parameters);
};

const getInitialValues = () => ({
    options: { required: false, disabled: false },
    validations: {},
    parameters: { feature: '' },
});

export default {
    TYPE,
    Options,
    ComplementInformation,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
