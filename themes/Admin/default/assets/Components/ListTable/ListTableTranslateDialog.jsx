import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';

export const ListTableTranslateDialog = ({ translateItem, setTranslateItem, languagesData, onTranslate }) => {
    const [translateLanguage, setTranslateLanguage] = useState('');

    return (
        <Dialog open={Boolean(translateItem)} onClose={() => setTranslateItem(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontSize: 20 }}>Traduction</DialogTitle>
            <DialogContent dividers>
                <FormControl fullWidth sx={{ marginTop: 3 }}>
                    <InputLabel id={`translate-label`} size="small">
                        Langue
                    </InputLabel>
                    <Select
                        labelId={`translate-label`}
                        variant="standard"
                        size="small"
                        id={`translateLanguage`}
                        value={translateLanguage}
                        onChange={(e) => {
                            setTranslateLanguage(e.target.value);
                        }}
                        label="Langue de traduction"
                    >
                        {languagesData?.languages
                            ?.filter((el) => el.id !== translateItem?.lang?.id)
                            ?.map((language, index) => (
                                <MenuItem key={index} value={language?.id} id={`selectTranslateLanguage-${language?.id}`}>
                                    {language?.name} ({language?.isoCode})
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                        color="error"
                        onClick={() => {
                            setTranslateItem(null);
                        }}
                        id="cancelDialog"
                    >
                        Annuler
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            if (translateLanguage !== '') {
                                onTranslate(translateItem?.id, translateLanguage);
                            } else {
                                NotificationManager.error('Veuillez renseigner la langue.', 'Erreur', Constant.REDIRECTION_TIME);
                            }
                        }}
                        id="validateDialog"
                    >
                        Suivant
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};