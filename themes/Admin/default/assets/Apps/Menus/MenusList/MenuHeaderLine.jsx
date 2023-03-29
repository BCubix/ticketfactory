import React, { useEffect, useState, useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate } from 'react-router-dom';

import { CardContent, FormControl, MenuItem, Select, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getLanguagesFromTranslatedElement } from '@Services/utils/translationUtils';

const SelectMenu = ({ selectedMenu, list, handleChange }) => {
    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                <Select
                    labelId={`select-menus-label`}
                    size="small"
                    id={`select-menus`}
                    variant="standard"
                    value={selectedMenu?.id || ''}
                    onChange={(e) => {
                        handleChange(e.target.value ? list.find((el) => el.id === e.target.value) : null);
                    }}
                    sx={{ marginLeft: 3, marginRight: 1, minWidth: 200 }}
                >
                    {list?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};

export const MenuHeaderLine = ({ selectedMenu, list, handleChange }) => {
    const navigate = useNavigate();

    return (
        <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
            <CardContent>
                <Typography component="span" variant="body1" display={'flex'} alignItems={'center'}>
                    {list?.length > 1 && (
                        <>
                            Selectionner votre menu : <SelectMenu selectedMenu={selectedMenu} list={list} handleChange={handleChange} />
                        </>
                    )}

                    <Component.CreateButton sx={{ marginLeft: 'auto' }} variant="contained" onClick={() => navigate(`${Constant.MENUS_BASE_PATH}${Constant.CREATE_PATH}`)}>
                        Nouveau
                    </Component.CreateButton>
                </Typography>
            </CardContent>
        </Component.CmtCard>
    );
};
