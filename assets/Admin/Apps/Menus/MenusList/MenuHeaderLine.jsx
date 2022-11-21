import React, { useState } from 'react';

import {
    Button,
    Card,
    CardContent,
    FormControl,
    Link,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';

import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

const SelectMenu = ({ selectedMenu, list, handleChange }) => {
    const [value, setValue] = useState(selectedMenu?.id);

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                <Select
                    labelId={`select-menus-label`}
                    size="small"
                    id={`select-menus`}
                    variant="standard"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
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

            <Button
                variant="outlined"
                sx={{ paddingBlock: '6px', marginRight: 2 }}
                onClick={() => handleChange(list.find((el) => el.id === value))}
            >
                Sélectionner
            </Button>
        </>
    );
};

export const MenuHeaderLine = ({ selectedMenu, list, handleChange }) => {
    return (
        <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
            <CardContent>
                <Typography component="span" variant="body1" display={'flex'} alignItems={'center'}>
                    {list?.length > 1 ? (
                        <>
                            Sélectionnez le menu à modifier :{' '}
                            <SelectMenu
                                selectedMenu={selectedMenu}
                                list={list}
                                handleChange={handleChange}
                            />
                            ou
                        </>
                    ) : (
                        list?.length > 0 && <>Modifiez votre menu ci-dessous, ou</>
                    )}
                    <Link sx={{ marginInline: 2 }} href={`${Constant.MENUS_BASE_PATH}${Constant.CREATE_PATH}`}>
                        {list.length === 0 ? 'C' : 'c'}réez un nouveau menu.
                    </Link>
                    N’oubliez pas d’enregistrer vos modifications !
                </Typography>
            </CardContent>
        </Component.CmtCard>
    );
};
