import { Box } from '@mui/system';
import { InputLabel, Typography } from '@mui/material';
import React from 'react';

import { Component } from '@/AdminService/Component';
import { changeSlug } from '@Services/utils/changeSlug';

export const CmtKeywordInput = ({ values, setFieldValue, name }) => {
    return (
        <Box
            sx={{ marginTop: 4, fontSize: 12, cursor: 'pointer', color: (theme) => theme.palette.info.main }}
            onClick={() => !values.editKeyword && setFieldValue('editKeyword', true)}
        >
            {values.editKeyword && (
                <Box sx={{ cursor: 'default', backgroundColor: (theme) => theme.palette.warning.light, p: 2, mb: 2, borderRadius: 2 }}>
                    <Typography sx={{ color: (theme) => theme.palette.warning.main }}>
                        Ce champs est utilisé par le thème pour repérer cette catégorie. Modifier cette valeur risque de perturber l'affichage de votre site.
                    </Typography>
                </Box>
            )}
            <InputLabel id="keywordLabel" sx={{ fontSize: 12, mt: 3 }}>
                Mot-clé
            </InputLabel>
            {values.editKeyword ? (
                <Component.CmtTextField
                    labelId={'keywordLabel'}
                    sx={{
                        margin: 0,
                        '& input': {
                            padding: 0,
                            fontSize: 14,
                            color: (theme) => theme.palette.info.main,
                        },
                    }}
                    fullWidth
                    value={values[name]}
                    onChange={(e) => setFieldValue(name, e.target.value)}
                    onBlur={() => {
                        setFieldValue(name, changeSlug(values[name]));
                    }}
                    size="small"
                />
            ) : (
                <Box sx={{ marginTop: 1, width: '100%', borderBottom: (theme) => `1px solid ${theme.palette.disabled.main}` }}>
                    <Typography component="span" sx={{ color: (theme) => theme.palette.disabled.main, width: '100%' }}>
                        {values[name] || "Aucun mot clé n'a été renseigné"}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
