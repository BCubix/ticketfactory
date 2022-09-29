import React from "react";
import {Formik} from "formik";

import {Box} from "@mui/system";
import {Button} from "@mui/material";

import {CmtTabs} from "@Components/CmtTabs/CmtTabs";
import {CmtPageWrapper} from "@Components/CmtPage/CmtPageWrapper/CmtPageWrapper";
import ParametersBlockForm from "@Apps/Parameters/ParametersForm/ParametersBlockForm";

function parametersForm({handleSubmit, parameters}) {
    const tabs = {};
    parameters.forEach((parameter) => {
        if (!tabs[parameter.tabName])
            tabs[parameter.tabName] = [parameter];
        else
            tabs[parameter.tabName].push(parameter);
    });

    return (
        <Formik
            initialValues={{
                parameters: tabs,
            }}
            onSubmit={(values, {setSubmitting}) => {
                let parametersList = [];
                Object.values(values.parameters).map(parameters => {
                    parametersList = [...parametersList, ...parameters]
                })
                handleSubmit({parameters: parametersList});
                setSubmitting(false);
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  setFieldTouched,
                  isSubmitting,
              }) => (
                <CmtPageWrapper
                    title="Paramètres"
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <CmtTabs
                        tabValue={0}
                        list={[ ...Object.entries(values.parameters).map(([tabName, parameter]) => {
                            return {
                                label: tabName,
                                component: (
                                    <ParametersBlockForm
                                        tabName={tabName}
                                        parameters={parameter}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        errors={errors}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                    />
                                )
                            }
                        })]}
                    />
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Enregistrer
                        </Button>
                    </Box>
                </CmtPageWrapper>
            )}
        </Formik>
    );
}

export default parametersForm;