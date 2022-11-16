import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { FormControlLabel, FormHelperText, Grid, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

const NAME = 'choiceList';
const LABEL = 'Liste de choix multiples';

const TYPE = 'choiceList';
const TYPE_GROUP_NAME = 'Choix';

const ComplementInformation = ({
    values,
    index,
    setFieldValue,
    handleBlur,
    prefixName,
    errors,
    touched,
}) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!values?.parameters?.choices) {
            return;
        }

        let tmpList = [];

        values?.parameters?.choices?.split('\n')?.forEach((element) => {
            const line = element.split(':');
            let val = line[0].trim();
            let lab = line.length > 1 ? line[1].trim() : val;

            tmpList.push({ value: val, label: lab });
        });

        setList(tmpList);
    }, []);

    const handleChangeChoice = ({ label, value, choiceIndex }) => {
        let newList = [...list];

        newList[choiceIndex] = { label, value };
        setList(newList);

        let choices = newList
            .map((el) => `${el.value}${el.label ? ` : ${el.label}` : ''}`)
            .join('\n');

        setFieldValue(`${prefixName}fields.${index}.parameters.choices`, choices);
    };

    const handleAddChoice = () => {
        let newList = [...list];

        newList.push({ label: '', value: '' });

        setList(newList);
    };

    const handleDeleteChoice = (deleteIndex) => {
        let newList = [...list];

        newList.splice(deleteIndex, 1);

        setList(newList);

        let choices = newList
            .map((el) => `${el.value}${el.label ? ` : ${el.label}` : ''}`)
            .join('\n');

        setFieldValue(`${prefixName}fields.${index}.parameters.choices`, choices);
    };

    return (
        <>
            <Typography variant="body1" sx={{ marginTop: 5 }}>
                Liste de choix
            </Typography>
            <Box marginTop={8} marginLeft={4} marginBottom={4}>
                <Grid container spacing={12}>
                    {list.map((item, ind) => (
                        <Grid
                            item
                            container
                            spacing={4}
                            xs={12}
                            sm={6}
                            key={ind}
                            position="relative"
                        >
                            <Component.CmtCard sx={{ width: '100%', position: 'relative', padding: 2 }}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}>
                                        <Component.CmtTextField
                                            value={item.label}
                                            onChange={(e) =>
                                                handleChangeChoice({
                                                    label: e.target.value,
                                                    value: item.value,
                                                    choiceIndex: ind,
                                                })
                                            }
                                            onBlur={handleBlur}
                                            required
                                            label="Label"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} position="relative">
                                        <Component.CmtTextField
                                            value={item.value}
                                            onChange={(e) =>
                                                handleChangeChoice({
                                                    label: item.label,
                                                    value: e.target.value,
                                                    choiceIndex: ind,
                                                })
                                            }
                                            onBlur={handleBlur}
                                            required
                                            label="Valeur"
                                        />
                                    </Grid>
                                </Grid>
                                <Component.DeleteBlockFabButton
                                    size={'small'}
                                    onClick={() => handleDeleteChoice(ind)}
                                >
                                    <CloseIcon />
                                </Component.DeleteBlockFabButton>
                            </Component.CmtCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <FormHelperText error>
                {
                    getNestedFormikError(touched?.fields, errors?.fields, index, 'parameters')
                        ?.choices
                }
            </FormHelperText>
            <Box className="flex row-end">
                <Component.AddBlockFabButton
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={handleAddChoice}
                >
                    <AddIcon />
                </Component.AddBlockFabButton>
            </Box>
        </>
    );
};

const Options = ({ values, index, setFieldValue, prefixName }) => {
    return (
        <>
            <Component.FieldFormControl fullWidth>
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
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
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
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
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
            </Component.FieldFormControl>
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

const getValidation = () => {
    return { choices: Yup.string().required('Veuillez renseigner votre liste de choix') };
};

export default {
    Options,
    ComplementInformation,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
    getValidation,
};
