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

const TYPE = 'file';

const VALIDATION_TYPE = 'mixed';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name }) => [1, `Veuillez renseigner le champ ${name}`],
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormComponent = ({ values, setFieldValue, name, field, label }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
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

    useEffect(() => {
        getMedias();
    }, [mediaFilters]);

    const handleSubmit = () => {
        setCreateDialog(false);
        getMedias();
        NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
    };

    useEffect(() => {
        if (!values[field.name]) {
            return;
        }

        if (field?.options?.multiple) {
            let list = values[field.name]?.map((el) => el?.id || el);
            setFieldValue(name, list);
        } else {
            setFieldValue(name, values[field.name]?.id || values[field.name]);
        }
    }, []);

    return (
        <>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Button variant="contained" size="small" onClick={() => setOpenModal(true)}>
                Ajouter {field?.options?.multiple ? 'des fichiers' : 'un fichier'}
            </Button>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullScreen TransitionComponent={Transition}>
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                    <Box display={'flex'} justifyContent="space-between">
                        <Typography component="h1" variant="h5" fontSize={20}>
                            Ajouter {field?.options?.multiple ? 'des fichiers' : 'un fichier'}
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
                                            (field.options.multiple && values[field.name].includes(item.id)) || values[field.name] === item.id
                                                ? {
                                                      outline: (theme) => `1px solid ${theme.palette.crud.create.textColor}`,
                                                      outlineOffset: '-1px',
                                                  }
                                                : {}
                                        }
                                    >
                                        {(field.options.multiple && values[field.name].includes(item.id)) ||
                                            (values[field.name] === item.id && (
                                                <CheckIcon sx={{ color: (theme) => theme.palette.crud.create.textColor, position: 'absolute', top: 5, right: 5 }} />
                                            ))}
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
                                onClose={() => setSelectedMedia(null)}
                                selectedMedia={selectedMedia}
                                values={values}
                                field={field}
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
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </>
    );
};

const DisplayMediaInformation = ({ onClose, selectedMedia, values, field, setFieldValue, name }) => {
    const isSelected = field?.options?.multiple ? values[field.name]?.includes(selectedMedia?.id) : values[field.name] === selectedMedia?.id;

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
                    const value = values[field.name];

                    let newValue = null;

                    if (field.options.multiple) {
                        newValue = value;

                        if (newValue.includes(selectedMedia?.id)) {
                            newValue = newValue.filter((el) => el !== selectedMedia?.id);
                        } else {
                            newValue.push(selectedMedia?.id);
                        }
                    } else {
                        newValue = value === selectedMedia?.id ? '' : selectedMedia?.id;
                    }

                    setFieldValue(name, newValue);
                }}
            >
                {isSelected ? 'Retirer' : 'Ajouter'} le fichier
            </Button>
        </Box>
    );
};

const getInitialValue = (field) => {
    return field?.options?.multiple ? [] : '';
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    VALIDATION_TYPE,
};
