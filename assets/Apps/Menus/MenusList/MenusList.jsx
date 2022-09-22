import { Grid } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { getMenusAction, menusSelector } from '../../../redux/menus/menusSlice';
import { AddMenuElement } from './AddMenuElement';
import { MenuHeaderLine } from './MenuHeaderLine';
import { MenuStructure } from './MenuStructure/MenuStructure';

export const MenusList = () => {
    const { loading, menus, error } = useSelector(menusSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    if (!menus || !initialValues) {
        return <></>;
    }

    return (
        <>
            <Formik
                initialValues={{
                    name: initialValues?.name,
                    menus: [...initialValues?.menus],
                    maxLevel: initialValues?.maxLevel || 3,
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
                    <CmtPageWrapper title={'Menus'}>
                        <MenuHeaderLine
                            selectedMenu={initialValues}
                            list={menus}
                            handleChange={(val) => {
                                setInitialValues(val);

                                setFieldValue('name', val.name);
                                setFieldValue('menus', val.menus);
                            }}
                        />

                        <Grid container spacing={5} sx={{ marginTop: 5 }}>
                            <Grid item xs={12} md={6} lg={3}>
                                <AddMenuElement
                                    addElementToMenu={(newElements) => {
                                        let menu = [...values.menus];

                                        newElements.forEach((el) => {
                                            menu.push(el);
                                        });

                                        setFieldValue('menus', menu);
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
                            </Grid>
                        </Grid>
                    </CmtPageWrapper>
                )}
            </Formik>
            ;
        </>
    );
};
