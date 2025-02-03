import React from 'react';
import { NotificationManager } from 'react-notifications';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const MarketplaceConnectionDialog = ({ open = false, onCancel, onConnected }) => {
    const handleSubmit = async (values) => {
        const result = await Api.marketplaceApi.marketplaceLogin(values);
        if (result?.result) {
            NotificationManager.success('Vous êtes bien connecté à la marketplace', 'Succès', Constant.REDIRECTION_TIME);
            onConnected();
        } else {
            NotificationManager.error(result?.error?.message, 'Erreur', Constant.REDIRECTION_TIME);
        }
    };

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Veuillez renseigner une adresse email.').email('Adresse email invalide.'),
                    password: Yup.string().required('Veuillez renseigner votre mot de passe.'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmit(values);

                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogTitle>Connexion à la marketplace Ticket Factory</DialogTitle>

                        <DialogContent dividers>
                            <Component.CmtTextField
                                margin="normal"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="username"
                                autoComplete="username"
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                            />
                            <Component.CmtTextField
                                margin="normal"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Box className="flex row-between align-center fullwidth" sx={{ width: '100%' }}>
                                <Button color="error" onClick={() => onCancel()} id="cancelMarketplaceDialog">
                                    Annuler
                                </Button>
                                <Button color="primary" type="submit" id="submitMarketplaceConnection" disabled={isSubmitting}>
                                    Connexion
                                </Button>
                            </Box>
                        </DialogActions>
                    </Box>
                )}
            </Formik>
        </Dialog>
    );
};
