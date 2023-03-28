import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Slide, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const CmtMediaModal = ({
    title,
    open,
    onClose,
    media,
    mediasList,
    setFieldValue,
    name,
    onAddNewMedia,
    onClick = null,
    AddMediaLabel = 'Sélectionner',
    RemoveMediaLabel = 'Désélectionner',
    mediaFilters,
    setMediaFilters,
    total,
    categoriesList,
}) => {
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    if (Array.isArray(media)) {
        media = media?.map((el) => el.id) || [];
    }

    useEffect(() => {
        setSelectedMedia(null);
    }, [open]);

    const handleSubmit = () => {
        setCreateDialog(false);
        onAddNewMedia();
        NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
    };

    return (
        <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Transition}>
            <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                <Box display="flex" justifyContent="space-between">
                    <Typography component="h1" variant="h5" fontSize={20}>
                        {title}
                    </Typography>

                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        id="close-media-modal"
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
                    <Grid item xs={12} md={9} px={5} py={5}>
                        <Component.CreateButton variant="contained" sx={{ marginLeft: 2 }} onClick={() => setCreateDialog(true)}>
                            Créer un nouveau média
                        </Component.CreateButton>

                        <Component.MediasFilters filters={mediaFilters} changeFilters={(values) => setMediaFilters(values)} categoriesList={categoriesList} />

                        <Box display="flex" pt={5} flexWrap="wrap">
                            {mediasList?.map((item, index) => (
                                <Component.CmtMediaElement
                                    key={index}
                                    onClick={() => setSelectedMedia(item)}
                                    position="relative"
                                    sx={
                                        (Array.isArray(media) ? media.includes(item.id) : media?.id === item.id)
                                            ? {
                                                  outline: (theme) => `1px solid ${theme.palette.crud.create.textColor}`,
                                                  outlineOffset: '-1px',
                                              }
                                            : {}
                                    }
                                >
                                    {(Array.isArray(media) ? media.includes(item.id) : media?.id === item.id) && (
                                        <CheckIcon sx={{ color: (theme) => theme.palette.crud.create.textColor, position: 'absolute', top: 5, right: 5 }} />
                                    )}
                                    <Component.CmtDisplayMediaType media={item} width={'100%'} />
                                </Component.CmtMediaElement>
                            ))}
                        </Box>

                        <Component.CmtPagination
                            page={mediaFilters.page}
                            total={total}
                            limit={mediaFilters.limit}
                            setPage={(newValue) => setMediaFilters({ ...mediaFilters, page: newValue })}
                            setLimit={(newValue) => setMediaFilters({ ...mediaFilters, limit: newValue })}
                            length={mediasList?.length}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ borderLeft: '1px solid #d3d3d3', height: '100%' }}>
                        <Component.CmtMediaModalInfos
                            media={media}
                            selectedMedia={selectedMedia}
                            onClose={() => setSelectedMedia(null)}
                            setFieldValue={setFieldValue}
                            name={name}
                            onClick={onClick}
                            AddMediaLabel={AddMediaLabel}
                            RemoveMediaLabel={RemoveMediaLabel}
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
    );
};
