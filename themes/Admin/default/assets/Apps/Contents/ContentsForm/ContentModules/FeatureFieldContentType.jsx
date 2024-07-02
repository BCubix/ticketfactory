import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const TYPE = 'feature';

const VALIDATION_TYPE = 'string';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name }) => [1, `Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({ values, setFieldValue, name, errors, field, label, touched }) => {
    const dispatch = useDispatch();
    const [features, setFeatures] = useState([]);
    const [featureCategories, setFeatureCategories] = useState([]);
    const [selectedFeatureCategory, setSelectedFeatureCategory] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.featuresApi.getAllFeatures().then((result) => {
                setFeatures(result.features);

                if (field.parameters.feature) {
                    let feature = result?.features?.find((item) => item?.id?.toString() === field.parameters.feature?.toString());

                    if (feature) {
                        setSelectedFeature(feature?.id);
                        setSelectedFeatureCategory(feature.featureCategory?.id);
                    }
                } else if (values[field.name]) {
                    let val = values[field.name]?.id || values[field.name];
                    let feature = result?.features?.find((feature) => feature?.featureValues?.find((featureValue) => featureValue?.id?.toString() === val?.toString()));

                    if (feature) {
                        setSelectedFeature(feature?.id);
                        setSelectedFeatureCategory(feature.featureCategory?.id);
                    }
                }
            });

            Api.featureCategoriesApi.getAllFeatureCategories().then((result) => setFeatureCategories(result.featureCategories));
        });
    }, []);

    useEffect(() => {
        if (!values[field.name]) {
            return;
        }

        setFieldValue(name, values[field.name]?.id || values[field.name]);
    }, [features, featureCategories]);

    return (
        <>
            <Box marginTop={8} marginLeft={4} marginBottom={4}>
                <Typography variant="body1" sx={{ marginTop: 5 }}>
                    {label}
                </Typography>
                <Grid container spacing={4}>
                    {!Boolean(field.parameters.feature) && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <Component.CmtSelect
                                    label="Catégorie d'attribut"
                                    value={selectedFeatureCategory || ''}
                                    list={featureCategories}
                                    getValue={(item) => item.id}
                                    getName={(item) => item.name}
                                    onChange={(e) => {
                                        setFieldValue(name, '');
                                        setSelectedFeatureCategory(e.target.value);
                                    }}
                                    emptyLabel={''}
                                    required={field?.options?.required}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Component.CmtSelect
                                    label="Attribut"
                                    value={selectedFeature || ''}
                                    list={features.filter((item) => item.featureCategory?.id?.toString() === selectedFeatureCategory?.toString())}
                                    getValue={(item) => item.id?.toString()}
                                    getName={(item) => item.name}
                                    onChange={(e) => {
                                        setFieldValue(name, '');
                                        setSelectedFeature(e.target.value);
                                    }}
                                    emptyLabel={"Pas d'attribut"}
                                    disabled={!Boolean(selectedFeatureCategory)}
                                    required={field?.options?.required}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} sm={Boolean(field.parameters?.feature) ? 12 : 4}>
                        <Component.CmtSelect
                            label="Valeur"
                            value={values[field.name] || ''}
                            list={
                                !Boolean(selectedFeature)
                                    ? []
                                    : features.find((it) => it.id?.toString() === selectedFeature?.toString())?.featureValues.filter((item) => !item.custom) || []
                            }
                            getValue={(item) => item.id?.toString()}
                            getName={(item) => item.value}
                            onChange={(e) => {
                                setFieldValue(name, e.target.value);
                            }}
                            emptyLabel={'Pas de valeur'}
                            disabled={!Boolean(selectedFeature)}
                            required={field?.options?.required}
                        />
                    </Grid>
                </Grid>

                {field.helper && (
                    <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 3 }}>
                        {field.helper}
                    </Typography>
                )}
            </Box>
        </>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
};
