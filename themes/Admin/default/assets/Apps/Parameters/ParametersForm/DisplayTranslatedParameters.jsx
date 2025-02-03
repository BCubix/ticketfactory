import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';

import { Component } from '@/AdminService/Component';

export const DisplayTranslatedParameters = ({
    parameter,
    languages,
    paramBreakpoints,
    indexParam,
    indexTab,
    indexBlock,
    ParametersTypeComponent,
    setFieldValue,
    handleChange,
    ...props
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState(languages?.find((el) => el?.isDefault)?.locale || '');
    return (
        <Grid item {...paramBreakpoints} key={indexParam} className="flex">
            <Box className="padding-right-2">
                <Component.CmtSelectField
                    label=""
                    value={selectedLanguage}
                    list={languages}
                    getValue={(item) => item.locale}
                    getName={(item) => item.locale.toUpperCase()}
                    setFieldValue={(_, value) => setSelectedLanguage(value)}
                    displayEmpty={false}
                />
            </Box>

            {selectedLanguage && (
                <ParametersTypeComponent
                    key={indexParam}
                    id={parameter.id}
                    paramName={parameter.name}
                    paramKey={`${parameter.paramKey}.${selectedLanguage}`}
                    paramValue={(parameter.paramValue && parameter?.paramValue[selectedLanguage]) || ''}
                    paramAvailableValue={parameter.availableValue}
                    validations={parameter.validations}
                    helper={parameter.helper || ''}
                    paramBreakpoints={{ xs: 12 }}
                    setFieldValue={(name, value) => {
                        setFieldValue(`${name}.${selectedLanguage}`, value);
                    }}
                    indexTab={indexTab}
                    indexBlock={indexBlock}
                    indexParam={indexParam}
                    handleChange={handleChange}
                />
            )}
        </Grid>
    );
};
