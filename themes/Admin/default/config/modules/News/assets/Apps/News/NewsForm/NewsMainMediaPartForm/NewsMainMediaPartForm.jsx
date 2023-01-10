import React, { useEffect, useState } from 'react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import {
    Dialog,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    Slide,
    Typography,
} from '@mui/material';

import { Component } from "@/AdminService/Component";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const NewsMainMediaPartForm = ({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    mediasList,
    name,
}) => {
    const [openModal, setOpenModal] = useState(false);

    if (!mediasList) {
        return <></>;
    }

    return (
        <Box mt={5}>
            <Typography
                variant="body1"
                sx={{ fontWeight: 500, mt: 2, color: (theme) => theme.palette.labelColor }}
            >
                Image principale
                <Typography component="span" className="MuiFormLabel-asterisk">
                    *
                </Typography>
            </Typography>
            <Component.CmtMediaElement
                onClick={() => {
                    setOpenModal(true);
                    setFieldTouched(name, true, false);
                }}
            >
                {values[name] ? (
                    <Component.CmtDisplayMediaType media={values[name]} width={'100%'} height={'auto'} />
                ) : (
                    <Box className="placeholder">
                        <AddCircleOutlineOutlinedIcon />
                    </Box>
                )}
            </Component.CmtMediaElement>
            <FormHelperText error>{touched[name] && errors[name]}</FormHelperText>

            <SelectMediaModal
                values={values}
                setFieldValue={setFieldValue}
                open={openModal}
                closeModal={() => setOpenModal(false)}
                mediasList={mediasList}
                name={name}
            />
        </Box>
    );
};

const SelectMediaModal = ({ open, closeModal, mediasList, name, values, setFieldValue }) => {
    const [selectedMedia, setSelectedMedia] = useState(null);

    useEffect(() => {
        setSelectedMedia(null);
    }, [open]);

    return (
        <Dialog open={open} onClose={closeModal} fullScreen TransitionComponent={Transition}>
            <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                <Box display={'flex'} justifyContent="space-between">
                    <Typography component="h1" variant="h5" fontSize={20}>
                        Séléctionner l'image principale de l'actualité
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
                            {mediasList?.map((item, index) => (
                                <Component.CmtMediaElement
                                    key={index}
                                    onClick={() => setSelectedMedia(item)}
                                    sx={{
                                        border: (theme) =>
                                            values[name]?.id === item?.id
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
                        <Component.DisplayNewsMediaInformations
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
