import React, { useCallback } from 'react';
import { FieldArray } from 'formik';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { Component } from '@/AdminService/Component';
import { getPropByString } from '@Services/utils/getPropByString';
import { Box } from '@mui/system';
import { Grid, IconButton } from '@mui/material';

export const CmtFeaturesInputField = ({ featuresList, values, setFieldValue, setFieldTouched, touched, errors, ...props }) => {
    const valuesList = useCallback(
        (item) => {
            if (!item?.feature || featuresList?.length === 0) {
                return [];
            }

            const feature = featuresList?.find((el) => parseInt(el.id) === parseInt(item?.feature));
            if (!feature) {
                return [];
            }

            return feature?.featureValues;
        },
        [values]
    );

    const valuesType = useCallback(
        (item) => {
            if (!item?.feature || featuresList?.length === 0) {
                return '';
            }

            const feature = featuresList?.find((el) => parseInt(el.id) === parseInt(item?.feature));
            if (!feature) {
                return '';
            }

            return feature?.type;
        },
        [values]
    );

    return (
        <FieldArray name={'featureLinks'}>
            {({ remove, push }) => (
                <>
                    {values &&
                        values?.featureLinks?.map((item, index) => (
                            <Component.CmtFormBlock key={index}>
                                <Box key={index}>
                                    <Component.DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Component.DeleteBlockFabButton>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={2} display="flex" alignItems="center">
                                            <Component.CmtSelectField
                                                label={'Attribut'}
                                                value={featuresList?.length > 0 ? item?.feature : ''}
                                                errors={getPropByString(touched, `featureLinks.${index}.feature`) && getPropByString(errors, `featureLinks.${index}.feature`)}
                                                list={featuresList || []}
                                                name={`featureLinks.${index}.feature`}
                                                setFieldValue={(name, newValue) => {
                                                    setFieldValue(name, newValue);
                                                    setFieldValue(`featureLinks.${index}.featureValue`, '');
                                                    setFieldValue(`featureLinks.${index}.featureValueRaw`, '');
                                                }}
                                                getName={(item) => item.name}
                                                getValue={(item) => item.id}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={5} display="flex" alignItems="center">
                                            <Component.CmtSelectField
                                                label={'Valeur'}
                                                value={item?.featureValue || ''}
                                                errors={
                                                    getPropByString(touched, `featureLinks.${index}.featureValue`) && getPropByString(errors, `featureLinks.${index}.featureValue`)
                                                }
                                                list={valuesList(item) || []}
                                                name={`featureLinks.${index}.featureValue`}
                                                setFieldValue={setFieldValue}
                                                setFieldTouched={setFieldTouched}
                                                getName={(item) => item.value}
                                                getValue={(item) => item.id}
                                                disabled={Boolean(!item?.feature || item?.featureValueRaw)}
                                                clearable
                                                required={!item?.featureValueRaw}
                                            />
                                            {item?.featureValue && (
                                                <IconButton sx={{ padding: 0, marginTop: 6 }} color="error" onClick={() => setFieldValue(`featureLinks.${index}.featureValue`, '')}>
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={5} display="flex" alignItems="center">
                                            <Component.CmtFeaturesTypeValues
                                                baseName={`featureLinks.${index}.`}
                                                name={'featureValueRaw'}
                                                label={'Valeur personnalisée'}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                {...props}
                                                type={valuesType(item)}
                                                featuresList={featuresList}
                                                touched={touched}
                                                errors={errors}
                                                disabled={Boolean(!item?.feature || item?.featureValue)}
                                                required={!item?.featureValue}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Component.CmtFormBlock>
                        ))}

                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            id="addField"
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                push({ feature: '', featureValue: '', featureValueRaw: '' });
                            }}
                        >
                            <AddIcon /> Ajouter un attribut
                        </Component.AddBlockButton>
                    </Component.CmtEndPositionWrapper>
                </>
            )}
        </FieldArray>
    );
};
