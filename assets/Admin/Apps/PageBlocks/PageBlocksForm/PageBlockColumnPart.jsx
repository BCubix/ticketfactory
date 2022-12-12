import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { Component } from '@/AdminService/Component';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';

const PageBlockColumnElem = ({ column, index, values, media, setFieldValue, setFieldTouched }) => {
    const [size, setSize] = useState(column[media]);

    useEffect(() => {
        setSize(column[media]);
    }, [media]);

    return (
        <Grid item key={index} xs={column[media]} sx={{ minHeight: 150, height: '100%' }}>
            <Component.CmtCard>
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" padding={3}>
                    <Box
                        height="100%"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 30,
                            width: 30,
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: (theme) => `1px solid ${theme.palette.crud.action.textColor}`,
                        }}
                    >
                        <MoreHorizIcon sx={{ color: (theme) => theme.palette.crud.action.textColor }} />
                    </Box>
                    <Box display="flex" alignItems={'center'} position="relative">
                        <Typography component="span" variant="h5">
                            Taille :
                        </Typography>
                        <Component.CmtTextField
                            fullWidth={false}
                            size="small"
                            value={size}
                            className="numberTypeField-noArrow"
                            sx={{ marginInline: 3, width: 50, marginBlock: 0 }}
                            onChange={(e) => {
                                let newValue = e.target.value;

                                if (!/^[0-9]*$/.test(newValue)) {
                                    return;
                                }

                                setSize(newValue);
                            }}
                            onBlur={() => {
                                let newValue = size;

                                if (newValue < 1) {
                                    newValue = 1;
                                    setSize(newValue);
                                } else if (newValue > 12) {
                                    newValue = 12;
                                    setSize(newValue);
                                }

                                console.log(newValue, size);
                                setFieldValue(`columns.${index}.${media}`, newValue);
                                setFieldTouched(`columns.${index}.${media}`, true, false);
                            }}
                            name={`columns.${index}.${media}`}
                        />
                        <Typography component="span" variant="h5">
                            / 12
                        </Typography>
                    </Box>

                    <Component.DeleteFabButton
                        size="small"
                        id={`removeColumn-${index}`}
                        sx={{ height: 30, width: 30, minHeight: 0, minWidth: 0 }}
                        onClick={() => {
                            remove(index);
                        }}
                    >
                        <DeleteIcon />
                    </Component.DeleteFabButton>
                </Box>
                <Component.LightEditorFormControl>
                    <Component.LightEditor
                        labelId={`column-${index}-content-label`}
                        value={values?.column?.at(index)?.content}
                        onBlur={() => setFieldTouched(`column.${index}.content`, true, false)}
                        onChange={(val) => {
                            setFieldValue(`column.${index}.content`, val);
                        }}
                    />
                </Component.LightEditorFormControl>
            </Component.CmtCard>
        </Grid>
    );
};

export const PageBlockColumnPart = ({ values, media, setFieldValue, setFieldTouched }) => {
    return (
        <FieldArray name="columns">
            {({ remove, push }) => (
                <Grid container spacing={4}>
                    {values?.columns?.map((column, index) => (
                        <PageBlockColumnElem
                            media={media}
                            index={index}
                            column={column}
                            key={index}
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />
                    ))}
                </Grid>
            )}
        </FieldArray>
    );
};
