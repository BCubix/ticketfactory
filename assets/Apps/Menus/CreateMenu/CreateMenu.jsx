import { Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MENUS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getMenusAction } from '../../../redux/menus/menusSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import menusApi from '../../../services/api/menusApi';
import * as Yup from 'yup';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import { NotificationManager } from 'react-notifications';

export const CreateMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createMenu = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await menusApi.createMenu(values);

        if (result.result) {
            NotificationManager.success('Le menu à bien été crée.', 'Succès', REDIRECTION_TIME);

            dispatch(getMenusAction());

            navigate(MENUS_BASE_PATH);
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
                <CmtPageWrapper component="form" onSubmit={handleSubmit} title="Création d'un menu">
                    <CmtFormBlock title="Informations générales">
                        <CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom du menu"
                            name="name"
                            error={touched.name && errors.name}
                            required
                        />
                    </CmtFormBlock>

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
                </CmtPageWrapper>
            )}
        </Formik>
    );
};
