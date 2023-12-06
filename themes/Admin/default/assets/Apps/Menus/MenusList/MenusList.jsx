import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';

import { Box, Button, Grid, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getMenusAction, menusSelector } from '@Apps/Menus/redux/menus/menusSlice';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getAvailableLanguages } from '@Services/utils/translationUtils';
import { DisplayFormTabs } from '../../../Components/CmtCrudForm/CmtCrudForm';

const serializeMenuData = (element, name, formData, datas) => {
    formData.append(`${name}[name]`, element.name);
    formData.append(`${name}[menuType]`, element.menuType);
    formData.append(`${name}[value]`, element.value);
    formData.append(`${name}[lang]`, element.lang || datas.lang || '');
    formData.append(`${name}[languageGroup]`, element.languageGroup || '');

    element?.children?.forEach((el, index) => {
        serializeMenuData(el, `${name}[children][${index}]`, formData, datas);
    });
};

export const menusInitialSchema = {
    name: (translationInitialValues) => translationInitialValues?.name || '',
    type: (translationInitialValues) => translationInitialValues?.menuType || null,
    value: (translationInitialValues) => translationInitialValues?.value || null,
    children: (translationInitialValues, { deserializeChildrenData }) => (translationInitialValues?.children ? deserializeChildrenData(translationInitialValues?.children) : []),
    maxLevel: (translationInitialValues) => translationInitialValues?.maxLevel || 3,
    lang: (translationInitialValues) => translationInitialValues?.lang?.id || '',
    languageGroup: (translationInitialValues) => translationInitialValues?.languageGroup || '',
};

export const menusEditCrud = {
    api: {
        dataFields: {
            name: { type: 'string' },
            menuType: {
                function: ({ values, formData }) => {
                    formData.append('menuType', values.menuType || 'none');
                },
            },
            value: { type: 'string' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            children: {
                function: ({ values, formData }) => {
                    values?.children?.forEach((el, index) => {
                        serializeMenuData(el, `children[${index}]`, formData, values);
                    });
                },
            },
        },
    },
    headerComponents: [
        {
            component: ({ setFieldValue, setTranslationInitialValues, changeFormikInitialValues, initialValues, setInitialValues, menus }) => (
                <Component.MenuHeaderLine
                    selectedMenu={initialValues}
                    list={menus}
                    handleChange={(val) => {
                        setInitialValues(val);
                        setTranslationInitialValues(val);
                        changeFormikInitialValues(setFieldValue, val);
                    }}
                />
            ),
        },
    ],
    fields: [
        {
            type: 'tabs',
            keyId: 'menu',
            label: 'Saison',
            fields: [
                {
                    component: ({ translationInitialValues, values, setFieldValue }) => (
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
                    ),
                },
                {
                    component: ({
                        translationInitialValues,
                        values,
                        setFieldValue,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                        languageList,
                        setTranslateDialog,
                        setTranslationInitialValues,
                        changeFormikInitialValues,
                        initialValues,
                        isSubmitting,
                        setDeleteDialog,
                        deleteDialog,
                    }) => (
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
                    ),
                },
            ],
        },
    ],
};

export const MenusList = () => {
    const { loading, menus, error } = useSelector(menusSelector);
    const languagesData = useSelector(languagesSelector);
    const dispatch = useDispatch();
    const [initialValues, setInitialValues] = useState(null);
    const [translationInitialValues, setTranslationInitialValues] = useState(null);

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
        <InitForm
            changeFormikInitialValues={changeFormikInitialValues}
            menus={menus}
            languageList={languageList}
            deserializeChildrenData={deserializeChildrenData}
            handleDelete={handleDelete}
            updateMenu={updateMenu}
            translationInitialValues={translationInitialValues}
            setTranslationInitialValues={setTranslationInitialValues}
            initialValues={initialValues}
            setInitialValues={setInitialValues}
            formCrud={Crud?.menus?.edit}
        />
    );
};

const InitForm = ({
    languageList,
    changeFormikInitialValues,
    translationInitialValues,
    setTranslationInitialValues,
    handleDelete,
    updateMenu,
    menus,
    initialValues,
    setInitialValues,
    deserializeChildrenData,
    formCrud,
}) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [translateDialog, setTranslateDialog] = useState(false);
    const navigate = useNavigate();

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
                    <Component.CmtDisplayComponents
                        list={formCrud?.headerComponents}
                        {...{ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }}
                        {...{
                            languageList,
                            changeFormikInitialValues,
                            translationInitialValues,
                            setTranslationInitialValues,
                            handleDelete,
                            updateMenu,
                            menus,
                            initialValues,
                            setInitialValues,
                            deserializeChildrenData,
                            formCrud,
                            translateDialog,
                            setTranslateDialog,
                        }}
                    />

                    {Object.keys(initialValues).length > 0 && (
                        <Grid container spacing={5} sx={{ marginTop: 5 }}>
                            <DisplayFormTabs
                                tabs={formCrud?.fields}
                                {...{ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }}
                                {...{
                                    languageList,
                                    changeFormikInitialValues,
                                    translationInitialValues,
                                    handleDelete,
                                    updateMenu,
                                    menus,
                                    initialValues,
                                    setInitialValues,
                                    deserializeChildrenData,
                                    formCrud,
                                    translateDialog,
                                    setTranslateDialog,
                                }}
                            />
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
