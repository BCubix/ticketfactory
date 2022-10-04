import { Box, Button, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';
import { REDIRECTION_TIME } from '../../../Constant';
import { getMenusAction, menusSelector } from '../../../redux/menus/menusSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import menusApi from '../../../services/api/menusApi';
import { AddMenuElement } from './AddMenuElement';
import { MenuHeaderLine } from './MenuHeaderLine';
import { MenuStructure } from './MenuStructure/MenuStructure';

export const MenusList = () => {
    const { loading, menus, error } = useSelector(menusSelector);
    const dispatch = useDispatch();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        if (!loading && !menus && !error) {
            dispatch(getMenusAction());
        }
    }, []);

    useEffect(() => {
        if (!menus || initialValues) {
            return;
        }

        if (menus.length === 0) {
            setInitialValues({});

            return;
        }

        setInitialValues(menus.at(-1));
    }, [menus]);

    const updateMenu = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await menusApi.updateMenu(initialValues.id, values);

        if (result.result) {
            NotificationManager.success('Le menu à bien été modifié.', 'Succès', REDIRECTION_TIME);

            dispatch(getMenusAction());
        }
    };

    const handleDelete = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await menusApi.deleteMenu(initialValues.id);

        if (result.result) {
            NotificationManager.success('Le menu à bien été supprimé.', 'Succès', REDIRECTION_TIME);

            setInitialValues(null);
            setDeleteDialog(false);

            dispatch(getMenusAction());
        }
    };

    if (!menus || !initialValues) {
        return <></>;
    }

    return (
        <>
            <Formik
                initialValues={{
                    name: initialValues?.name || '',
                    type: initialValues?.menuType || null,
                    value: initialValues?.value || null,
                    children: initialValues?.children ? [...initialValues?.children] : [],
                    maxLevel: initialValues?.maxLevel || 3,
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    await updateMenu(values);

                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting,
                }) => (
                    <CmtPageWrapper title={'Menus'} component="form" onSubmit={handleSubmit}>
                        <MenuHeaderLine
                            selectedMenu={initialValues}
                            list={menus}
                            handleChange={(val) => {
                                setInitialValues(val);

                                setFieldValue('name', val.name);
                                setFieldValue('type', val.type);
                                setFieldValue('value', val.value);
                                setFieldValue('children', val.children);
                            }}
                        />

                        {Object.keys(initialValues).length > 0 && (
                            <Grid container spacing={5} sx={{ marginTop: 5 }}>
                                <Grid item xs={12} md={6} lg={3}>
                                    <AddMenuElement
                                        addElementToMenu={(newElements) => {
                                            let menu = [...values.children];

                                            newElements.forEach((el) => {
                                                menu.push(el);
                                            });

                                            setFieldValue('children', menu);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={9}>
                                    <MenuStructure
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        errors={errors}
                                    />

                                    <Box className="flex row-between">
                                        <Button
                                            variant="outlined"
                                            sx={{ mt: 3, mb: 2 }}
                                            isSubmitting
                                            color="error"
                                            onClick={() => setDeleteDialog(!deleteDialog)}
                                        >
                                            Supprimer
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            disabled={isSubmitting}
                                        >
                                            Modifier
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}

                        <DeleteDialog
                            open={deleteDialog ? true : false}
                            onCancel={() => setDeleteDialog(null)}
                            onDelete={() => handleDelete(deleteDialog)}
                        >
                            <Box textAlign="center" py={3}>
                                <Typography component="p">
                                    Êtes-vous sûr de vouloir supprimer ce menu ?
                                </Typography>

                                <Typography component="p">
                                    Cette action est irréversible.
                                </Typography>
                            </Box>
                        </DeleteDialog>
                    </CmtPageWrapper>
                )}
            </Formik>
        </>
    );
};
