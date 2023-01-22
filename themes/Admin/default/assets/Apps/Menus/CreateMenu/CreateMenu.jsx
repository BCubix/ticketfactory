import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box, Button } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getMenusAction } from '@Redux/menus/menusSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const menuId = queryParameters.get('menuId');
    const languageId = queryParameters.get('languageId');

    const createMenu = (values) => {
        return apiMiddleware(dispatch, async () => {
            const result = await Api.menusApi.createMenu(values);
            if (result.result) {
                NotificationManager.success('Le menu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getMenusAction());
                navigate(Constant.MENUS_BASE_PATH);
            }
        });
    };

    useEffect(() => {
        if (!menuId || !languageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            let menu = await Api.menusApi.getTranslated(menuId, languageId);
            if (!menu?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.MENUS_BASE_PATH);
                return;
            }

            setInitialValues(menu.menu);
        });
    }, []);

    const menusSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du menu.'),
    });

    if (menuId && !initialValues) {
        return <></>;
    }

    return (
        <Formik
            initialValues={{ name: initialValues?.name || '', lang: languageId || '', languageGroup: initialValues?.languageGroup || '' }}
            validationSchema={menusSchema}
            onSubmit={async (values, { setSubmitting }) => {
                await createMenu(values);

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting} id="submitForm">
                            Créer
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
