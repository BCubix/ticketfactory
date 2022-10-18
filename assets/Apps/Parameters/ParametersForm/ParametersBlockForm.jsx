import React, {useMemo} from 'react';

import {CmtFormBlock} from "@Components/CmtFormBlock/CmtFormBlock";

import {Grid} from "@mui/material";
import ParametersTypesModules from "@Apps/Parameters/ParametersForm/ParametersTypesModules";

const parseBreakpointsValue = (breakpointsValueStr) => {
    const breakpoints = {};

    breakpointsValueStr.split(' ').forEach((e) => {
        const breakpointInfo = e.split('-');
        if (!breakpointInfo || breakpointInfo.length < 2)
            return;

        const [ name, value ] = breakpointInfo;
        if (name !== 'xs' && name !== 'md' && name !== 'lg')
            return;

        breakpoints[name] = parseInt(value);
    });

    return breakpoints;
};

function ParametersBlockForm({indexTab, blocks, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue}) {
    const parametersTypesModules = useMemo(() => {
        return ParametersTypesModules();
    }, []);

    return blocks?.map(({blockName, parameters}, indexBlock) => (
        <CmtFormBlock title={blockName} key={indexBlock}>
            <Grid container spacing={4}>
                {parameters?.map(({name, type, paramKey, paramValue, availableValue, breakpointsValue}, indexParam) => {
                    const ParametersTypeComponent = parametersTypesModules[type].getComponent;
                    const paramBreakpoints = parseBreakpointsValue(breakpointsValue);

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
                        />
                    );
                })}
            </Grid>
        </CmtFormBlock>
    ));
}

export default ParametersBlockForm;