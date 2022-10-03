import React, {useMemo} from 'react';

import {CmtFormBlock} from "@Components/CmtFormBlock/CmtFormBlock";

import {Grid} from "@mui/material";
import ParametersTypesModules from "@Apps/Parameters/ParametersForm/ParametersTypesModules";

function ParametersBlockForm({indexTab, blocks, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue}) {
    const parametersTypesModules = useMemo(() => {
        return ParametersTypesModules();
    }, []);

    return blocks?.map(({blockName, parameters}, indexBlock) => (
        <CmtFormBlock title={blockName} key={indexBlock}>
            <Grid container spacing={4}>
                {parameters?.map(({name, key, type, value, availableValue}, indexParam) => {
                    const ParametersTypeComponent = parametersTypesModules[type].getComponent;
                    return (
                        <ParametersTypeComponent
                            key={indexParam}
                            paramName={name}
                            paramKey={key}
                            paramValue={value}
                            paramAvailableValue={availableValue}
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