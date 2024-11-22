import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Box, Grid, Typography } from '@mui/material';

const LABEL = 'Attributs';
const TYPE = 'feature';
const TYPE_GROUP_NAME = 'Liens';

const FormComponent = ({ value, errors, touched, name, label, setFieldValue }) => {
    const dispatch = useDispatch();
    const [features, setFeatures] = useState([]);
    const [featureCategories, setFeatureCategories] = useState([]);
    const [selectedFeatureCategory, setSelectedFeatureCategory] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.featuresApi.getAllFeatures().then((result) => {
                setFeatures(result.features);

                if (value) {
                    let val = value?.id || value;
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
        if (!value) {
            return;
        }

        setFieldValue(name, value?.id || value);
    }, [features, featureCategories]);

    return (
        <Box className="margin-3">
            <Grid container spacing={4}>
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
                        disabled={!selectedFeatureCategory}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Component.CmtSelect
                        label="Valeur"
                        value={value || ''}
                        list={!selectedFeature ? [] : features.find((it) => it.id?.toString() === selectedFeature?.toString())?.featureValues.filter((item) => !item.custom) || []}
                        getValue={(item) => item.id?.toString()}
                        getName={(item) => item.value}
                        onChange={(e) => {
                            setFieldValue(name, e.target.value);
                        }}
                        emptyLabel={'Pas de valeur'}
                        disabled={!selectedFeature}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
};
