import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import moment from 'moment/moment';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputLabel, Slide, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useDispatch } from 'react-redux';

const LABEL = 'Fichier';
const TYPE = 'file';
const TYPE_GROUP_NAME = 'Contenu';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormComponent = ({ value, errors, touched, name, label, setFieldTouched, setFieldValue }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [mediaName, setMediaName] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediasTotal, setMediasTotal] = useState(null);
    const [mediaFilters, setMediaFilters] = useState({
        title: '',
        active: null,
        sort: 'id ASC',
        page: 1,
        limit: 20,
        type: [],
    });

    const getMedias = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList({ ...mediaFilters });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setList(result.medias);
            setMediasTotal(result.total);
        });
    };

    const getMediaName = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getOneMedia(value?.id || value);
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setMediaName(result?.media?.title || 'Aucun fichier sélectioné');
        });
    };

    useEffect(() => {
        getMedias();
    }, [mediaFilters]);

    useEffect(() => {
        getMediaName();
    }, [openModal]);

    const handleSubmit = () => {
        setCreateDialog(false);
        getMedias();
        NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
    };

    useEffect(() => {
        if (!value) {
            return;
        }

        setFieldValue(name, value?.id || value);
    }, []);

    return (
        <Box className="margin-3">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Box className="flex align-center">
                <Button variant="contained" size="small" onClick={() => setOpenModal(true)}>
                    Ajouter un fichier
                </Button>
                <Typography marginLeft={2}>{mediaName}</Typography>
            </Box>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullScreen TransitionComponent={Transition}>
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                    <Box display={'flex'} justifyContent="space-between">
                        <Typography component="h1" variant="h5" fontSize={20}>
                            Ajouter un fichier
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
                                    <Component.CmtMediaElement key={index} onClick={() => setSelectedMedia(item)} position="relative">
                                        <Component.CmtDisplayMediaType media={item} width={'100%'} />
                                    </Component.CmtMediaElement>
                                ))}
                            </Box>

                            <Component.CmtPagination
                                page={mediaFilters.page}
                                total={mediasTotal}
                                limit={mediaFilters.limit}
                                setPage={(newValue) => setMediaFilters({ ...mediaFilters, page: newValue })}
                                setLimit={(newValue) => setMediaFilters({ ...mediaFilters, limit: newValue })}
                                length={list?.length}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ borderLeft: '1px solid #d3d3d3', height: '100%' }}>
                            <DisplayMediaInformation
                                onClose={() => {
                                    setSelectedMedia(null);
                                    setOpenModal(false);
                                }}
                                selectedMedia={selectedMedia}
                                value={value}
                                setFieldValue={setFieldValue}
                                name={name}
                            />
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
    const isSelected = value == selectedMedia?.id;

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">Selectionnez un élément pour afficher ses détails</Typography>
            </Box>
        );
    }

    return (
        <Box position="relative" px={10}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

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
                    let newValue = null;

                    newValue = value == selectedMedia?.id ? '' : selectedMedia?.id;

                    setFieldValue(name, newValue);
                    onClose();
                }}
            >
                Sélectionner le fichier
            </Button>
        </Box>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

export default {
    TYPE,
    getSelectEntry,
    FormComponent,
};
