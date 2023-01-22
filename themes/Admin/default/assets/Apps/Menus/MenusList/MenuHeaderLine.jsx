import React, { useEffect, useState, useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';

import { CardContent, FormControl, Link, MenuItem, Select, Typography } from '@mui/material';

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

export const MenuHeaderLine = ({ selectedMenu, list, handleChange, changeLanguage, translationSelectedMenu }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(translationSelectedMenu?.lang);

    const selectedMenuLanguages = useMemo(() => {
        return getLanguagesFromTranslatedElement(selectedMenu);
    }, [selectedMenu]);

    useEffect(() => {
        setSelectedLanguage(translationSelectedMenu?.lang);
    }, [translationSelectedMenu]);

    return (
        <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
            <CardContent>
                <Typography component="span" variant="body1" display={'flex'} alignItems={'center'}>
                    {list?.length > 1 ? (
                        <>
                            Sélectionnez le menu à modifier : <SelectMenu selectedMenu={selectedMenu} list={list} handleChange={handleChange} />
                            ou
                        </>
                    ) : (
                        list?.length > 0 && <>Modifiez votre menu ci-dessous, ou</>
                    )}
                    <Link sx={{ marginInline: 2 }} href={`${Constant.MENUS_BASE_PATH}${Constant.CREATE_PATH}`}>
                        {list.length === 0 ? 'C' : 'c'}réez un nouveau menu.
                    </Link>
                    N’oubliez pas d’enregistrer vos modifications !
                    {selectedMenuLanguages?.length > 1 && (
                        <FormControl sx={{ m: 1, minWidth: 100, marginLeft: 'auto' }} size="small">
                            <Select
                                labelId={`select-menus-language-label`}
                                size="small"
                                id={`select-menus-language`}
                                variant="standard"
                                value={selectedLanguage?.id || ''}
                                onChange={(e) => {
                                    if (e.target.value === translationSelectedMenu?.lang?.id) {
                                        return;
                                    }

                                    let newElement = null;

                                    if (selectedMenu?.lang?.id === e.target.value) {
                                        newElement = selectedMenu;
                                    } else {
                                        newElement = selectedMenu?.translatedElements?.find((el) => el.lang?.id === e.target.value);
                                    }

                                    changeLanguage(newElement || null);
                                    setSelectedLanguage(selectedMenuLanguages?.find((el) => el.id === e.target.value));
                                }}
                                sx={{ marginLeft: 3, marginRight: 1, minWidth: 200 }}
                            >
                                {selectedMenuLanguages?.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
                                        <ReactCountryFlag countryCode={item?.isoCode} style={{ fontSize: '1.5rem', marginRight: '5px' }} /> {item.name} ({item.isoCode})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Typography>
            </CardContent>
        </Component.CmtCard>
    );
};
