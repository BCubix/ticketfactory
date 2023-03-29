import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';

import { Box, Button, Grid, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getMenusAction, menusSelector } from '@Redux/menus/menusSlice';
import { languagesSelector } from '@Redux/languages/languagesSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getAvailableLanguages } from '@Services/utils/translationUtils';

export const MenusList = () => {
    const { loading, menus, error } = useSelector(menusSelector);
    const languagesData = useSelector(languagesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const [translationInitialValues, setTranslationInitialValues] = useState(null);
    const [translateDialog, setTranslateDialog] = useState(false);

    useEffect(() => {
        if (!loading && !menus && !error) {
            dispatch(getMenusAction());
        }
    }, []);

    useEffect(() => {
        if (!menus) {
            return;
        }

        if (menus.length === 0) {
            setInitialValues({});
            setTranslationInitialValues({});
            return;
        }

        if (initialValues) {
            const element = menus?.find((el) => el.id === initialValues?.id);
            if (element?.id === translationInitialValues?.id) {
                setTranslationInitialValues(element);
            } else {
                setTranslationInitialValues(element?.translatedElements?.find((el) => el.id === translationInitialValues?.id) || element);
            }

            if (element) {
                setInitialValues(element);
            }

            return;
        }

        setInitialValues(menus.at(-1));
        setTranslationInitialValues(menus.at(-1));
    }, [menus]);

    const updateMenu = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.menusApi.updateMenu(translationInitialValues.id, values);
            if (result.result) {
                NotificationManager.success('Le menu a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getMenusAction());
            }
        });
    };

    const handleDelete = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.menusApi.deleteMenu(translationInitialValues.id);
            if (result.result) {
                NotificationManager.success('Le menu a bien été supprimé.', 'Succès', Constant.REDIRECTION_TIME);

                if (initialValues?.id === translationInitialValues?.id) {
                    setInitialValues(null);
                }
                setTranslationInitialValues(null);
                setDeleteDialog(false);

                dispatch(getMenusAction());
            }
        });
    };

    const deserializeChildrenData = (children) => {
        let childrenList = [];

        if (!children) {
            return [];
        }

        children?.forEach((el) => {
            let newElement = { ...el, lang: el?.lang?.id || '' };

            if (el?.children?.length > 0) {
                newElement.children = deserializeChildrenData(el.children);
            }

            childrenList.push(newElement);
        });

        return childrenList;
    };

    const languageList = useMemo(() => {
        if (initialValues?.id !== translationInitialValues?.id) {
            return [];
        }

        return getAvailableLanguages(initialValues, languagesData);
    }, [initialValues, languagesData?.languages]);

    const changeFormikInitialValues = (setFieldValue, values) => {
        if (!values) {
            return;
        }

        setFieldValue('name', values.name);
        setFieldValue('type', values.type);
        setFieldValue('value', values.value);
        setFieldValue('lang', values.lang?.id);
        setFieldValue('languageGroup', values.languageGroup);
        setFieldValue('children', deserializeChildrenData(values.children));
    };

    if (!menus || !initialValues || !translationInitialValues || !languagesData.languages) {
        return <></>;
    }

    return (
        <Formik
            initialValues={{
                name: translationInitialValues?.name || '',
                type: translationInitialValues?.menuType || null,
                value: translationInitialValues?.value || null,
                children: translationInitialValues?.children ? deserializeChildrenData(translationInitialValues?.children) : [],
                maxLevel: translationInitialValues?.maxLevel || 3,
                lang: translationInitialValues?.lang?.id || '',
                languageGroup: translationInitialValues?.languageGroup || '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
                updateMenu(values);

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Component.CmtPageWrapper title={'Menus'} component="form" onSubmit={handleSubmit}>
                    <Component.MenuHeaderLine
                        selectedMenu={initialValues}
                        list={menus}
                        handleChange={(val) => {
                            setInitialValues(val);
                            setTranslationInitialValues(val);
                            changeFormikInitialValues(setFieldValue, val);
                        }}
                    />

                    {Object.keys(initialValues).length > 0 && (
                        <Grid container spacing={5} sx={{ marginTop: 5 }}>
                            <Grid item xs={12} md={6} lg={3}>
                                <Component.AddMenuElement
                                    language={translationInitialValues?.lang}
                                    addElementToMenu={(newElements) => {
                                        let menu = [...values.children];

                                        newElements.forEach((el) => {
                                            if (!el?.lang) {
                                                menu.push({ ...el, lang: values?.lang });
                                            } else {
                                                menu.push(el);
                                            }
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
                                    languageList={languageList}
                                    openTranslateDialog={() => setTranslateDialog(true)}
                                    language={translationInitialValues?.lang}
                                    translationSelectedMenu={translationInitialValues}
                                    changeLanguage={(val) => {
                                        setTranslationInitialValues(val);
                                        changeFormikInitialValues(setFieldValue, val);
                                    }}
                                    selectedMenu={initialValues}
                                />

                                <Box className="flex row-between">
                                    <Button
                                        variant="outlined"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={isSubmitting}
                                        color="error"
                                        onClick={() => setDeleteDialog(!deleteDialog)}
                                        id="deleteMenuButton"
                                    >
                                        Supprimer
                                    </Button>

                                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting} id="submitForm">
                                        Modifier
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                        <Box textAlign="center" py={3}>
                            <Typography component="p">Êtes-vous sûr de vouloir supprimer ce menu ?</Typography>

                            <Typography component="p">Cette action est irréversible.</Typography>
                        </Box>
                    </Component.DeleteDialog>

                    <Component.CmtTranslateDialog
                        item={initialValues}
                        isOpen={translateDialog}
                        onClose={() => setTranslateDialog(false)}
                        languageList={languageList}
                        onTranslate={(id, languageId) => navigate(`${Constant.MENUS_BASE_PATH}${Constant.CREATE_PATH}?menuId=${id}&languageId=${languageId}`)}
                    />
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
