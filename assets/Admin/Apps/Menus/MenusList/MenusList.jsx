import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';

import { Box, Button, Grid, Typography } from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getMenusAction, menusSelector } from '@Redux/menus/menusSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

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
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.menusApi.updateMenu(initialValues.id, values);

        if (result.result) {
            NotificationManager.success('Le menu a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getMenusAction());
        }
    };

    const handleDelete = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.menusApi.deleteMenu(initialValues.id);

        if (result.result) {
            NotificationManager.success('Le menu a bien été supprimé.', 'Succès', Constant.REDIRECTION_TIME);

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
                    updateMenu(values);

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
                    <Component.CmtPageWrapper title={'Menus'} component="form" onSubmit={handleSubmit}>
                        <Component.MenuHeaderLine
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
                                    <Component.AddMenuElement
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
                                    <Component.MenuStructure
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
                                            disabled={isSubmitting}
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

                        <Component.DeleteDialog
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
                        </Component.DeleteDialog>
                    </Component.CmtPageWrapper>
                )}
            </Formik>
        </>
    );
};
