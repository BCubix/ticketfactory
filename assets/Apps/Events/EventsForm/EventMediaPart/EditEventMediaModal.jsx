import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Radio,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { CmtDisplayMediaType } from '../../../../Components/CmtDisplayMediaType/CmtDisplayMediaType';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { getMediaType } from '../../../../services/utils/getMediaType';
import { DisplayMediaInformations } from './DisplayMediaInformations';

export const EditEventMediaModal = ({
    open,
    closeModal,
    selectedMedia,
    selectedMediaIndex,
    values,
    handleChange,
    setFieldValue,
    errors,
    name,
}) => {
    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={closeModal}>
            <DialogTitle sx={{ fontSize: 20 }}>Détails de l'élément média</DialogTitle>
            {open && (
                <DialogContent dividers>
                    <Grid container spacing={4} sx={{ mb: -4, minHeight: 300 }}>
                        <Grid
                            item
                            sx={{ mt: 4, mb: 4 }}
                            xs={12}
                            sm={6}
                            md={7}
                            display="flex"
                            flexDirection={'column'}
                            alignItems={'center'}
                        >
                            <CmtDisplayMediaType
                                media={selectedMedia}
                                maxWidth={'50%'}
                                maxHeight={200}
                                sx={{ objectFit: 'contain' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={5} sx={{ borderLeft: '1px solid #D3D3D3' }}>
                            <Box
                                display="flex"
                                alignItems={'flex-end'}
                                justifyContent="space-between"
                                flexWrap={'wrap'}
                            >
                                <CmtTextField
                                    value={values.eventMedias?.at(selectedMediaIndex)?.position}
                                    onChange={handleChange}
                                    name={`medias.${selectedMediaIndex}.position`}
                                    error={errors.eventMedias?.at(selectedMediaIndex)?.position}
                                    label={'Position'}
                                    type="number"
                                    fullWidth={false}
                                    sx={{ maxWidth: 100 }}
                                />
                                {getMediaType(selectedMedia.documentType) === 'image' && (
                                    <FormControlLabel
                                        onClick={() => {
                                            let newValue = values.eventMedias.map((el, index) => ({
                                                ...el,
                                                mainImg:
                                                    selectedMediaIndex === index ? true : false,
                                            }));
                                            setFieldValue(name, newValue);
                                        }}
                                        control={
                                            <Radio
                                                checked={
                                                    values.eventMedias.at(selectedMediaIndex)
                                                        ?.mainImg
                                                }
                                            />
                                        }
                                        label={'Image de couverture ?'}
                                    />
                                )}
                            </Box>

                            <DisplayMediaInformations selectedMedia={selectedMedia} />

                            <Box display="flex" my={5}>
                                <Button
                                    variant={'outlined'}
                                    color={'error'}
                                    onClick={() => {
                                        let newValue = values.eventMedias.filter(
                                            (el) => el.id !== selectedMedia?.id
                                        );
                                        setFieldValue(name, newValue);
                                        closeModal();
                                    }}
                                >
                                    Retirer le fichier
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            )}
        </Dialog>
    );
};
