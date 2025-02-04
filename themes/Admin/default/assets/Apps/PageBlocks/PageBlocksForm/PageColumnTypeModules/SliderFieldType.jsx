import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import moment from 'moment/moment';

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputLabel, Slide, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

const LABEL = 'Slider';
const TYPE = 'slider';
const TYPE_GROUP_NAME = 'Groupes';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormComponent = ({ value, setFieldValue, name, label }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [imageMediasTotal, setImageMediasTotal] = useState(null);
    const [mediaFilters, setMediaFilters] = useState({
        title: '',
        active: null,
        sort: 'id ASC',
        page: 1,
        limit: 20,
    });

    const getMedias = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList({ ...mediaFilters, type: ['Image'] });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.medias);
            setImageMediasTotal(result.total);
        });
    };

    const handleSubmit = () => {
        setCreateDialog(false);
        getMedias();
        NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
    };

    useEffect(() => {
        getMedias();
    }, [mediaFilters]);

    useEffect(() => {
        if (!value) {
            return;
        }

        let list = value || [];
        if (typeof value === 'string') {
            list = value?.split(',') || value;
        } else if (typeof value === 'object') {
            list = value?.map((el) => el?.id || el) || value;
        }

        setFieldValue(name, list);
    }, []);

    return (
        <Box className="margin-3">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Button variant="contained" size="small" onClick={() => setOpenModal(true)}>
                Ajouter des images
            </Button>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullScreen TransitionComponent={Transition}>
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                    <Box display={'flex'} justifyContent="space-between">
                        <Typography component="h1" variant="h5" fontSize={20}>
                            Ajouter des images
                        </Typography>

                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenModal(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box height="100%" width={'100%'} sx={{ padding: 0 }}>
                    <Grid container sx={{ height: '100%' }}>
                        <Grid item xs={12} md={9} sx={{ paddingInline: 5, paddingTop: 5 }}>
                            <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Créer un nouveau média
                            </Component.CreateButton>

                            <Component.MediasFilters filters={mediaFilters} changeFilters={(values) => setMediaFilters(values)} />

                            <Box display="flex" px={5} py={10} flexWrap="wrap">
                                {list?.map((item, index) => (
                                    <Component.CmtMediaElement
                                        key={index}
                                        onClick={() => setSelectedMedia(item)}
                                        position="relative"
                                        sx={
                                            value.includes(item.id) || value == item.id
                                                ? {
                                                      outline: (theme) => `1px solid ${theme.palette.crud.create.textColor}`,
                                                      outlineOffset: '-1px',
                                                  }
                                                : {}
                                        }
                                    >
                                        {(value.includes(item.id) || value == item.id) && (
                                            <CheckIcon sx={{ color: (theme) => theme.palette.crud.create.textColor, position: 'absolute', top: 5, right: 5 }} />
                                        )}
                                        <Component.CmtDisplayMediaType media={item} width={'100%'} />
                                    </Component.CmtMediaElement>
                                ))}
                            </Box>

                            <Component.CmtPagination
                                page={mediaFilters.page}
                                total={imageMediasTotal}
                                limit={mediaFilters.limit}
                                setPage={(newValue) => setMediaFilters({ ...mediaFilters, page: newValue })}
                                setLimit={(newValue) => setMediaFilters({ ...mediaFilters, limit: newValue })}
                                length={list?.length}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ borderLeft: '1px solid #d3d3d3', height: '100%' }}>
                            <DisplayMediaInformation onClose={() => setSelectedMedia(null)} selectedMedia={selectedMedia} value={value} setFieldValue={setFieldValue} name={name} />
                        </Grid>
                    </Grid>
                </Box>
                <Dialog fullWidth maxWidth="md" open={createDialog} onClose={() => setCreateDialog(false)}>
                    <DialogTitle sx={{ fontSize: 20 }}>Ajouter un fichier</DialogTitle>
                    <DialogContent>
                        <Component.CreateMedia handleSubmit={handleSubmit} />
                    </DialogContent>
                </Dialog>
            </Dialog>
        </Box>
    );
};

const DisplayMediaInformation = ({ onClose, selectedMedia, value, setFieldValue, name }) => {
    const isSelected = value?.includes(selectedMedia?.id);

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">Selectionnez un élément pour afficher ses détails</Typography>
            </Box>
        );
    }

    return (
        <Box position="relative" px={10}>
            <Box sx={{ paddingTop: 10 }}>
                <Box>
                    <Typography component="span" variant="body2">
                        Crée le :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {moment(selectedMedia?.createdAt).format('DD-MM-YYYY')}
                    </Typography>
                </Box>

                {selectedMedia?.updatedAt && (
                    <Box>
                        <Typography component="span" variant="body2">
                            Mis à jour le :
                        </Typography>
                        <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                            {moment(selectedMedia?.updatedAt).format('DD-MM-YYYY')}
                        </Typography>
                    </Box>
                )}

                <Box>
                    <Typography component="span" variant="body2">
                        Type de fichier :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.documentType}
                    </Typography>
                </Box>

                <Box>
                    <Typography component="span" variant="body2">
                        Nom du fichier :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.documentFileName}
                    </Typography>
                </Box>

                <Box>
                    <Typography component="span" variant="body2">
                        Titre :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.title}
                    </Typography>
                </Box>
            </Box>

            <Box my={10} display="flex" justifyContent={'center'}>
                <Box maxWidth={'100%'} maxHeight={'300px'} display="flex" justifyContent="center">
                    <Component.CmtDisplayMediaType media={selectedMedia} maxWidth={'100%'} maxHeight={'300px'} />
                </Box>
            </Box>

            {selectedMedia?.description && (
                <Box>
                    <Typography variant="body2">Description :</Typography>
                    <Typography variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.description}
                    </Typography>
                </Box>
            )}

            {selectedMedia?.legend && (
                <Box>
                    <Typography variant="body2">Légende :</Typography>
                    <Typography variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.legend}
                    </Typography>
                </Box>
            )}

            <Button
                variant={isSelected ? 'outlined' : 'contained'}
                color={isSelected ? 'error' : 'primary'}
                onClick={() => {
                    let newValue = value || [];

                    if (newValue.includes(selectedMedia?.id)) {
                        newValue = newValue.filter((el) => el != selectedMedia?.id);
                    } else {
                        newValue.push(selectedMedia?.id);
                    }

                    setFieldValue(name, newValue);
                }}
            >
                {isSelected ? 'Retirer' : 'Ajouter'} le fichier
            </Button>
        </Box>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getInitialValue = () => {
    return [];
};

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
    getInitialValue,
};
