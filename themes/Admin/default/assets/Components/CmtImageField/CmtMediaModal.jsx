import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    updatedMedia = null,
    imageFormatList,
}) => {
    const updateRequestNb = useRef(0);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [multipleSelect, setMultipleSelect] = useState([]);

    const multiple = useMemo(() => {
        return Array.isArray(media);
    }, []);

    if (multiple) {
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

    const handleMultipleClick = (item, ctrlKey, shiftKey) => {
        let selected = [...multipleSelect];

        if (ctrlKey) {
            const index = selected.findIndex((it) => it.id === item.id);
            if (index === -1) {
                selected.push(item);
            } else {
                selected.splice(index, 1);
            }
        } else if (shiftKey && selected.length > 0) {
            const lastId = selected[selected.length - 1].id;
            const lastIndex = mediasList.findIndex((it) => it.id === lastId);
            const newIndex = mediasList.findIndex((it) => it.id === item.id);

            if (lastIndex === -1 || newIndex === -1) {
                setMultipleSelect([]);
                return;
            }

            const startIndex = Math.min(lastIndex, newIndex);
            const endIndex = Math.max(lastIndex, newIndex);
            let newSelection = mediasList.slice(startIndex, endIndex + 1);

            newSelection?.forEach((it) => {
                if (selected.findIndex((el) => el.id === it.id) === -1) {
                    selected.push(it);
                }
            });
        } else {
            selected = [item];
        }

        setMultipleSelect(selected);
    };

    const handleAddMultiple = () => {
        if (onClick === null) {
            return;
        }

        multipleSelect?.forEach((item) => {
            if (!media?.includes(item?.id)) {
                onClick(item);
            }
        });

        setMultipleSelect([]);
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (updateRequestNb.current <= 0) {
                    closeModal();
                }
            }}
            fullScreen
            TransitionComponent={Transition}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                <Box display="flex" justifyContent="space-between">
                    <Typography component="h1" variant="h5" fontSize={20}>
                        {title}
                    </Typography>

                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            if (updateRequestNb.current <= 0) {
                                closeModal();
                            }
                        }}
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

                        <Component.MediasFilters
                            filters={mediaFilters}
                            changeFilters={(values) => {
                                setMultipleSelect([]);
                                setMediaFilters(values);
                            }}
                            categoriesList={categoriesList}
                        />

                        <Box display="flex" pt={5} flexWrap="wrap">
                            {mediasList?.map((item, index) => (
                                <Component.CmtMediaElement
                                    key={index}
                                    onClick={(e) => {
                                        if (multiple) {
                                            handleMultipleClick(item, e.ctrlKey, e.shiftKey);
                                        }
                                        setSelectedMedia(item);
                                    }}
                                    position="relative"
                                    sx={
                                        item.id === selectedMedia?.id || multipleSelect?.findIndex((it) => it.id === item.id) !== -1
                                            ? {
                                                  outline: (theme) => `3px solid ${theme.palette.crud.action.textColor}`,
                                                  outlineOffset: '-3px',
                                              }
                                            : (multiple ? media.includes(item.id) : media?.id === item.id)
                                            ? {
                                                  outline: (theme) => `3px solid ${theme.palette.crud.create.textColor}`,
                                                  outlineOffset: '-3px',
                                              }
                                            : {}
                                    }
                                >
                                    {(multiple ? media.includes(item.id) : media?.id === item.id) && (
                                        <CheckIcon sx={{ color: (theme) => theme.palette.crud.create.textColor, position: 'absolute', top: 5, right: 5 }} />
                                    )}
                                    <Component.CmtDisplayMediaType media={item} displayThumbnail width={'100%'} />
                                </Component.CmtMediaElement>
                            ))}
                        </Box>

                        <Component.CmtPagination
                            page={mediaFilters.page}
                            total={total}
                            limit={mediaFilters.limit}
                            setPage={(newValue) => {
                                setMultipleSelect([]);
                                setMediaFilters({ ...mediaFilters, page: newValue });
                            }}
                            setLimit={(newValue) => {
                                setMultipleSelect([]);
                                setMediaFilters({ ...mediaFilters, limit: newValue });
                            }}
                            length={mediasList?.length}
                        />

                        {multipleSelect.length > 1 && (
                            <Box sx={{ display: 'flex', marginTop: 5 }}>
                                <Component.ActionButton variant="contained" sx={{ marginLeft: 'auto' }} onClick={handleAddMultiple}>
                                    Ajouter les médias
                                </Component.ActionButton>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ borderLeft: '1px solid #d3d3d3', height: '100%', marginTop: 3 }}>
                        <Component.CmtMediaModalInfos
                            media={media}
                            selectedMedia={selectedMedia}
                            onClose={() => setSelectedMedia(null)}
                            setFieldValue={setFieldValue}
                            name={name}
                            onClick={onClick}
                            AddMediaLabel={AddMediaLabel}
                            RemoveMediaLabel={RemoveMediaLabel}
                            startUpdatingMedia={() => {
                                updateRequestNb.current += 1;
                            }}
                            endUpdatingMedia={() => {
                                updateRequestNb.current -= 1;
                            }}
                            updatedMedia={(newMedia) => {
                                if (selectedMedia?.id === newMedia?.id) {
                                    setSelectedMedia(newMedia);
                                }

                                let findIndex = multipleSelect.findIndex((it) => it.id === newMedia.id);
                                if (findIndex !== -1) {
                                    let selected = [...multipleSelect];
                                    selected[findIndex] = newMedia;
                                    setMultipleSelect(selected);
                                }

                                if (updatedMedia) {
                                    updatedMedia(newMedia);
                                }
                            }}
                            imageFormatList={imageFormatList}
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
