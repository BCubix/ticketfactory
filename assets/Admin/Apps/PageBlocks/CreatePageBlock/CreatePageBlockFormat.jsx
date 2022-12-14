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
    };
};

export const CreatePageBlockFormat = ({ name, setName, formatIndex, setFormatIndex, displaySave = false, saveAsModel, setSaveAsModel }) => {
    return (
        <>
            <Box display="flex" flexDirection={'column'}>
                <Component.CmtTextField sx={{ maxWidth: 400 }} value={name} onChange={(event) => setName(event.target.value)} label="Nom du bloc" />
                {console.log(saveAsModel)}
                {displaySave && (
                    <FormControlLabel
                        size="small"
                        value={saveAsModel}
                        onChange={(e) => {
                            setSaveAsModel(e.target.checked);
                        }}
                        label={'Enregistrer ce bloc comme modèle pour une utilisation ultérieur'}
                        labelPlacement="end"
                        control={<Checkbox />}
                    />
                )}
            </Box>
            <FormControl fullWidth sx={{ marginTop: 5 }}>
                <FormLabel>Selectionner un format de bloc pour démarrer.</FormLabel>
                <RadioGroup row name="Format" value={formatIndex} onChange={(event) => setFormatIndex(Number(event.target.value))}>
                    <Grid container spacing={4} sx={{ width: '100%' }}>
                        {Constant.PAGE_BLOCKS_FORMATS.map((values, index) => (
                            <Grid item xs={6} md={4} xl={2}>
                                <Grid container spacing={0} sx={{ height: '4rem', display: 'flex', justifyContent: 'center' }}>
                                    {values.map((value) => (
                                        <Grid item xl={value} height={'100%'}>
                                            <Box height={'100%'} sx={{ border: (theme) => `1px solid ${theme.palette.primary.main}` }}></Box>
                                        </Grid>
                                    ))}
                                    <FormControlLabel
                                        value={index}
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
        </>
    );
};
