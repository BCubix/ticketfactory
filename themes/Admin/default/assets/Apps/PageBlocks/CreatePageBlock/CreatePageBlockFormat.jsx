import React from 'react';
import { Component } from '@/AdminService/Component';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Constant } from '@/AdminService/Constant';

const getFormatLabel = (values) => {
    values = values.map((e) => e.toString() + '/12');
    return values.join(' - ');
};

export const GetPageBlockColumn = (value) => {
    return {
        content: '',
        xs: 12,
        s: 12,
        m: 12,
        l: 12,
        xl: value,
        type: 'text',
    };
};

export const CreatePageBlockFormat = ({ newBlockData, setNewBlockData, displaySave = false, pageBlockTypesList }) => {
    return (
        <>
            <Box display="flex" flexDirection={'column'}>
                <Component.CmtTextField value={newBlockData.name} onChange={(event) => setNewBlockData({ ...newBlockData, name: event.target.value })} label="Nom du bloc" />
                {displaySave && (
                    <FormControlLabel
                        size="small"
                        value={newBlockData.saveAsModel}
                        onChange={(e) => {
                            setNewBlockData({ ...newBlockData, saveAsModel: e.target.checked });
                        }}
                        label={'Enregistrer ce bloc comme modèle pour une utilisation ultérieure'}
                        labelPlacement="end"
                        control={<Checkbox />}
                    />
                )}
            </Box>

            <Box className="margin-top-5">
                <Component.CmtSelect
                    label="Type de bloc"
                    id={`pageBlockTypeInput`}
                    value={newBlockData.pageBlockType}
                    list={pageBlockTypesList}
                    emptyLabel={'Bloc libre'}
                    getValue={(item) => item?.id}
                    getName={(item) => item?.name}
                    setFieldValue={(_, newValue) => {
                        setNewBlockData({ ...newBlockData, pageBlockType: newValue });
                    }}
                />

                {newBlockData.pageBlockType === '' && (
                    <Box className="margin-top-5">
                        <FormControl fullWidth>
                            <FormLabel>Selectionner un format de bloc pour démarrer.</FormLabel>
                            <RadioGroup
                                row
                                name="Format"
                                value={newBlockData.formatIndex}
                                onChange={(event) => setNewBlockData({ ...newBlockData, formatIndex: Number(event.target.value) })}
                            >
                                <Grid container spacing={4} sx={{ width: '100%' }}>
                                    {Constant.PAGE_BLOCKS_FORMATS.map((values, index) => (
                                        <Grid key={index} item xs={6} md={4} lg={3} xl={2}>
                                            <Grid container spacing={0} sx={{ height: '4rem', display: 'flex', justifyContent: 'center' }}>
                                                {values.map((value, valueIndex) => (
                                                    <Grid item xl={value} height={'100%'} key={valueIndex}>
                                                        <Box height={'100%'} sx={{ border: (theme) => `1px solid ${theme.palette.primary.main}` }}></Box>
                                                    </Grid>
                                                ))}
                                                <FormControlLabel
                                                    value={index}
                                                    id={`createBlock-${index}`}
                                                    control={<Radio />}
                                                    label={
                                                        <Typography component="span" variant="body2">
                                                            {getFormatLabel(values)}
                                                        </Typography>
                                                    }
                                                    labelPlacement="top"
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                )}
            </Box>
        </>
    );
};
