import React, { useMemo } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Box, Button } from '@mui/material';

import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';
import { getDeserializationApiValue } from '@Apps/Parameters/services/config/deserializationApi';

import { parametersSelector, getParametersAction } from '@Apps/Parameters/redux/parameters/parametersSlice';

export const UrlParameters = ({ parametersNameList = Crud.url.list.parameterList, formCrud = Crud.parameters.edit }) => {
    const { parameters } = useSelector(parametersSelector);
    const dispatch = useDispatch();

    const urlParameters = useMemo(() => {
        return parameters?.filter((item) => parametersNameList?.includes(item?.paramKey));
    }, [parameters, parametersNameList]);

    const tabs = useMemo(() => {
        const tabs = [];

        urlParameters?.forEach((parameter) => {
            if (!parameter?.tabName) {
                return;
            }

            const indexTab = tabs.findIndex((tab) => tab.tabName === parameter.tabName);
            parameter = { ...parameter, paramValue: getDeserializationApiValue(parameter.type, parameter.paramValue) };

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
    }, [urlParameters]);

    async function handleSubmit(values) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.parametersApi.editParameters(values);
            if (result.result) {
                NotificationManager.success('Les paramètres ont bien été modifiés.', 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getParametersAction());
            } else {
                NotificationManager.error(result?.error?.message || 'Une erreur est survenue.', 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    }

    if (!parameters) {
        return <></>;
    }

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
                <Box component="form" onSubmit={handleSubmit}>
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
                    <Box className="block-active">
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            Enregistrer
                        </Button>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};
