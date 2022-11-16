import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box, Button } from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getMenusAction } from '@Redux/menus/menusSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const CreateMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createMenu = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.menusApi.createMenu(values);

        if (result.result) {
            NotificationManager.success('Le menu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getMenusAction());

            navigate(Constant.MENUS_BASE_PATH);
        }
    };

    const menusSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du menu.'),
    });

    return (
        <Formik
            initialValues={{ name: '' }}
            validationSchema={menusSchema}
            onSubmit={(values, { setSubmitting }) => {
                createMenu(values);

                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                setFieldValue,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title="Création d'un menu">
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom du menu"
                            name="name"
                            error={touched.name && errors.name}
                            required
                        />
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Créer
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
