import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, Grid, IconButton, Slide, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AddEventMediaModal = ({
    open,
    closeModal,
    mediaList,
    values,
    name,
    setFieldValue,
}) => {
    const [selectedMedia, setSelectedMedia] = useState(null);
    const addedElements = values.eventMedias?.map((el) => el.id) || [];

    useEffect(() => {
        setSelectedMedia(null);
    }, [open]);

    return (
        <Dialog open={open} onClose={closeModal} fullScreen TransitionComponent={Transition}>
            <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                <Box display={'flex'} justifyContent="space-between">
                    <Typography component="h1" variant="h5" fontSize={20}>
                        Ajouter des éléments média à l'évènement
                    </Typography>

                    <IconButton
                        aria-label="close"
                        onClick={closeModal}
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
                    <Grid item xs={12} md={9}>
                        <Box display="flex" px={5} py={10} flexWrap="wrap">
                            {mediaList?.map((item, index) => (
                                <Component.CmtMediaElement
                                    key={index}
                                    onClick={() => setSelectedMedia(item)}
                                    sx={{
                                        border: (theme) =>
                                            addedElements.includes(item.id)
                                                ? `1px solid ${theme.palette.primary.main}`
                                                : '',
                                    }}
                                >
                                    <Component.CmtDisplayMediaType media={item} width={'100%'} />
                                </Component.CmtMediaElement>
                            ))}
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ borderLeft: '1px solid #d3d3d3', height: '100%' }}
                    >
                        <Component.DisplayMediaAddInformations
                            onClose={() => setSelectedMedia(null)}
                            selectedMedia={selectedMedia}
                            values={values}
                            setFieldValue={setFieldValue}
                            name={name}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    );
};
