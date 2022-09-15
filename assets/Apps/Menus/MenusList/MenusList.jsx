import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { getMenusAction, menusSelector } from '../../../redux/menus/menusSlice';
import { AddMenuElement } from './AddMenuElement';
import { MenuHeaderLine } from './MenuHeaderLine';

export const MenusList = () => {
    const { loading, menus, error } = useSelector(menusSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        if (!loading && !menus && !error) {
            dispatch(getMenusAction());
        }
    }, []);

    useEffect(() => {
        if (!menus || menus?.length === 0 || selectedMenu) {
            return;
        }

        setSelectedMenu(menus.at(-1));
    }, [menus]);

    if (!menus || !selectedMenu) {
        return <></>;
    }

    return (
        <>
            <CmtPageWrapper title={'Menus'}>
                <MenuHeaderLine
                    selectedMenu={selectedMenu}
                    list={menus}
                    handleChange={(val) => setSelectedMenu(val)}
                />

                <Grid container spacing={5} sx={{ marginTop: 5 }}>
                    <Grid item xs={12} md={6} lg={3}>
                        <AddMenuElement />
                    </Grid>
                    <Grid item xs={12} md={6} lg={9}>
                        Structure du menu
                    </Grid>
                </Grid>
            </CmtPageWrapper>
        </>
    );
};
