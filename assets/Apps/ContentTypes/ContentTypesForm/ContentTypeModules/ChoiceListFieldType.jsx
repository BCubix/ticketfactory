import { FormControlLabel, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { FieldFormControl } from '../sc.ContentTypeFields';

const NAME = 'choiceList';
const LABEL = 'Liste de choix';

const TYPE = 'choiceList';
const TYPE_GROUP_NAME = 'Choix';

const ComplementInformation = ({ values, index, handleChange, handleBlur, prefixName, errors }) => {
    return (
        <>
            <CmtTextField
                value={values.parameters.choices}
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${prefixName}fields.${index}.parameters.choices`}
                error={errors?.parameters?.choices}
                required
                label="Liste des choix"
                multiline
                rows={4}
            />

            <Box mt={1} mb={5}>
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    Indiquez une valeur par ligne.
                </Typography>
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    Vous pouvez spécifier la valeur et le libellé de cette manière.
                </Typography>
                <Typography component="p" variant="body2" sx={{ marginTop: 1, fontSize: 10 }}>
                    rouge : Rouge
                </Typography>
            </Box>
        </>
    );
};

const Options = ({ values, index, setFieldValue, prefixName }) => {
    return (
        <>
            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.required)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.required`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Requis'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.disabled)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.disabled`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Désactivé'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.multiple)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.multiple`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Multiple'}
                    labelPlacement="start"
                />
            </FieldFormControl>
        </>
    );
};

const getSelectEntry = () => ({ name: NAME, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [{ label: 'Options', component: (props) => <Options {...props} /> }];

const setInitialValues = (prefixName, setFieldValue) => {
    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
    setFieldValue(`${prefixName}.parameters`, getInitialValues().parameters);
};

const getInitialValues = () => ({
    options: { required: false, disabled: false, multiple: false },
    validations: {},
    parameters: { choices: '' },
});

export default {
    Options,
    ComplementInformation,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
