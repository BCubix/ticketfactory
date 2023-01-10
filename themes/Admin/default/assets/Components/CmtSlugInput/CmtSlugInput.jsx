import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import React from 'react';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { changeSlug } from '@Services/utils/changeSlug';

export const CmtSlugInput = ({ values, setFieldValue, name }) => {
    return (
        <Box sx={{ fontSize: 12, cursor: 'pointer', color: (theme) => theme.palette.info.main }} onClick={() => !values.editSlug && setFieldValue('editSlug', true)}>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {Constant.FRONT_URL}/.../
            </Typography>
            {values.editSlug ? (
                <Component.CmtTextField
                    sx={{
                        margin: 0,
                        '& input': {
                            padding: 0,
                            fontSize: 14,
                            color: (theme) => theme.palette.info.main,
                        },
                    }}
                    fullWidth={false}
                    value={values[name]}
                    onChange={(e) => setFieldValue(name, e.target.value)}
                    onBlur={() => {
                        setFieldValue(name, changeSlug(values[name]));
                    }}
                    size="small"
                />
            ) : (
                <Typography component="span">{values.slug}</Typography>
            )}
        </Box>
    );
};
