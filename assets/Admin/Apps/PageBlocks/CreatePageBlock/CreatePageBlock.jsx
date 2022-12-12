import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getPageBlocksAction } from '@Redux/pageBlocks/pageBlocksSlice';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Box } from '@mui/system';

const FORMATS = [[12], [6, 6], [4, 8], [8, 4], [4, 4, 4], [3, 6, 3]];

const getFormatLabel = (values) => {
    values = values.map((e) => e.toString() + '/12');
    return values.join(' - ');
};

const getColumn = (value) => {
    return {
        content: '',
        xs: 12,
        s: 12,
        m: 12,
        l: 12,
        xl: value,
    };
};

export const CreatePageBlock = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [dialog, setDialog] = useState(true);
    const [submitModel, setSubmitModel] = useState(false);

    const [name, setName] = useState('');
    const [formatIndex, setFormatIndex] = useState(0);
    const [model, setModel] = useState({
        name: '',
        saveAsModel: true,
        columns: [],
    });

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlockApi.createPageBlock(values);

            if (result?.result) {
                NotificationManager.success('Le block de page a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);

                dispatch(getPageBlocksAction());
                navigate(Constant.PAGE_BLOCKS_BASE_PATH);
            }
        });
    };

    const handleCreate = () => {
        const columns = [];
        FORMATS[formatIndex].forEach((value) => {
            columns.push(getColumn(value));
        });

        model.name = name;
        model.columns = columns;

        setModel(model);
        setSubmitModel(true);
        setDialog(false);
    };

    return (
        <>
            {submitModel && <Component.PageBlocksForm handleSubmit={handleSubmit} initialValues={model} />}
            <Dialog
                open={dialog}
                maxWidth="md"
                fullWidth
                onClose={() => {
                    setDialog(false);
                    if (!submitModel) {
                        navigate(Constant.PAGE_BLOCKS_BASE_PATH);
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                    <Typography component="h3" variant="h3" fontSize={20}>
                        Créer un nouveau bloc
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ minHeight: 250 }}>
                    <Component.CmtTextField value={name} onChange={(event) => setName(event.target.value)} label="Nom du bloc" />
                    <FormControl fullWidth sx={{ marginTop: 5 }}>
                        <FormLabel>Selectionner un format de bloc pour démarrer.</FormLabel>
                        <RadioGroup row name="Format" value={formatIndex} onChange={(event) => setFormatIndex(Number(event.target.value))}>
                            <Grid container spacing={4} sx={{ width: '100%' }}>
                                {FORMATS.map((values, index) => (
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreate}>Créer</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
