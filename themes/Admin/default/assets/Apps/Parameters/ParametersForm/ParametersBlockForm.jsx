import React, { useMemo } from 'react';

import { Grid, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

import ParametersTypesModules from '@Apps/Parameters/ParametersForm/ParametersTypesModules';

const parseBreakpointsValue = (breakpointsValueStr) => {
    const breakpoints = {};

    breakpointsValueStr?.split(' ').forEach((e) => {
        const breakpointInfo = e.split('-');
        if (!breakpointInfo || breakpointInfo.length < 2) return;

        const [name, value] = breakpointInfo;
        if (name !== 'xs' && name !== 'md' && name !== 'lg') return;

        breakpoints[name] = parseInt(value);
    });

    return breakpoints;
};

export const ParametersBlockForm = ({ indexTab, blocks, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue }) => {
    const parametersTypesModules = useMemo(() => {
        return ParametersTypesModules();
    }, []);

    return blocks?.map(({ blockName, parameters }, indexBlock) => (
        <Component.CmtFormBlock title={blockName} key={indexBlock}>
            <Grid container spacing={4}>
                {parameters?.map(({ id, name, type, paramKey, paramValue, validations, availableValue, breakpointsValue }, indexParam) => {
                    const ParametersTypeComponent = parametersTypesModules[type]?.getComponent;
                    const paramBreakpoints = parseBreakpointsValue(breakpointsValue);

                    if (!ParametersTypeComponent) {
                        return (
                            <Grid item {...paramBreakpoints} key={indexParam}>
                                <Typography>Module introuvable ou corrompu</Typography>
                            </Grid>
                        );
                    }

                    return (
                        <ParametersTypeComponent
                            key={indexParam}
                            paramName={name}
                            paramKey={paramKey}
                            paramValue={paramValue}
                            paramAvailableValue={availableValue}
                            paramBreakpoints={paramBreakpoints}
                            setFieldValue={setFieldValue}
                            indexTab={indexTab}
                            indexBlock={indexBlock}
                            indexParam={indexParam}
                            id={id}
                            validations={validations}
                            handleChange={handleChange}
                        />
                    );
                })}
            </Grid>
        </Component.CmtFormBlock>
    ));
};
