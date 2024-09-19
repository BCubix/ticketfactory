import React, { useMemo } from 'react';
import { Formik } from 'formik';

import { Box } from '@mui/system';
import { Button } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { parameterTypes } from '../services/config/parameterTypes';
import { Crud } from '@/AdminService/Crud';
import { serializationApi } from '../services/config/serializationApi';
import { deserializationApi, getDeserializationApiValue } from '../services/config/deserializationApi';

export const parametersFormCrud = {
    parametersTypesModules: parameterTypes,
    serializationApi: serializationApi,
    deserializationApi: deserializationApi,
};

export const ParametersForm = ({ moduleParameters, themeParameters, module, theme, handleSubmit, parameters, formCrud = Crud.parameters.edit }) => {
    const tabs = useMemo(() => {
        const tabs = [];

        parameters?.forEach((parameter) => {
            if (!parameter?.tabName) {
                return;
            }

            const indexTab = tabs.findIndex((tab) => tab.tabName === parameter.tabName);
            parameter = { ...parameter, paramValue: getDeserializationApiValue(parameter) };

            if (indexTab === -1) {
                tabs.push({
                    tabName: parameter.tabName,
                    blocks: [
                        {
                            blockName: parameter.blockName,
                            parameters: [parameter],
                        },
                    ],
                });
            } else {
                const blocks = tabs[indexTab].blocks;
                const indexBlock = blocks.findIndex((block) => block.blockName === parameter.blockName);
                if (indexBlock === -1) {
                    blocks.push({
                        blockName: parameter.blockName,
                        parameters: [parameter],
                    });
                } else {
                    blocks[indexBlock].parameters.push(parameter);
                }
            }
        });

        return tabs;
    }, [parameters]);

    const parametersTitle = useMemo(() => {
        if (moduleParameters) {
            if (!module) {
                return 'Paramètres des modules';
            }
            return `Paramètres du module ${module.name}`;
        } else if (themeParameters) {
            if (!theme) {
                return 'Paramètres des thèmes';
            }
            return `Paramètres du thème ${theme.name}`;
        }
        return 'Paramètres';
    }, []);

    return (
        <Formik
            initialValues={{
                tabs: tabs,
            }}
            onSubmit={(values, { setSubmitting }) => {
                const parameters = values.tabs.reduce((parametersList, { blocks }) => {
                    for (const block of blocks) {
                        parametersList = [...parametersList, ...block.parameters];
                    }
                    return parametersList;
                }, []);

                handleSubmit({ parameters: parameters });
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper title={parametersTitle} component="form" onSubmit={handleSubmit}>
                    <Component.CmtTabs
                        tabValue={0}
                        list={values.tabs.map(({ tabName, blocks }, indexTab) => {
                            return {
                                label: tabName,
                                component: (
                                    <Component.ParametersBlockForm
                                        indexTab={indexTab}
                                        blocks={blocks}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        errors={errors}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        parametersTypesModules={formCrud.parametersTypesModules}
                                    />
                                ),
                            };
                        })}
                    />
                    <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
                            Enregistrer
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
