import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

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

export const DisplayParameters = ({ parameters, indexTab, indexBlock, handleChange, setFieldValue, parametersTypesModules, languages }) => {
    return parameters?.map((parameter, indexParam) => {
        const ParametersTypeComponent = parametersTypesModules[parameter.type]?.getComponent;
        const paramBreakpoints = parseBreakpointsValue(parameter.breakpointsValue);

        if (!ParametersTypeComponent) {
            return (
                <Grid item {...paramBreakpoints} key={indexParam}>
                    <Typography>Module introuvable ou corrompu</Typography>
                </Grid>
            );
        }

        if (parameter.translatedParameter) {
            return (
                <Component.DisplayTranslatedParameters
                    key={indexParam}
                    parameter={parameter}
                    paramBreakpoints={paramBreakpoints}
                    setFieldValue={setFieldValue}
                    indexTab={indexTab}
                    indexBlock={indexBlock}
                    indexParam={indexParam}
                    handleChange={handleChange}
                    ParametersTypeComponent={ParametersTypeComponent}
                    languages={languages}
                />
            );
        }

        return (
            <ParametersTypeComponent
                key={indexParam}
                id={parameter.id}
                paramName={parameter.name}
                paramKey={parameter.paramKey}
                paramValue={parameter.paramValue}
                paramAvailableValue={parameter.availableValue}
                validations={parameter.validations}
                paramBreakpoints={paramBreakpoints}
                setFieldValue={setFieldValue}
                indexTab={indexTab}
                indexBlock={indexBlock}
                indexParam={indexParam}
                handleChange={handleChange}
            />
        );
    });
};

export const ParametersBlockForm = ({ blocks, ...rest }) => {
    const { languages } = useSelector(languagesSelector);

    return blocks?.map(({ blockName, parameters }, indexBlock) => (
        <Component.CmtFormBlock title={blockName} key={indexBlock}>
            <Grid container spacing={4}>
                <DisplayParameters parameters={parameters} languages={languages} indexBlock={indexBlock} {...rest} />
            </Grid>
        </Component.CmtFormBlock>
    ));
};
