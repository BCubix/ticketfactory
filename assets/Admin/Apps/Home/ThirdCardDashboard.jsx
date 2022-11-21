import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { useTheme } from '@emotion/react';

import {
    Button,
    CardContent,
    CardHeader,
    Link,
    List,
    ListItemButton,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getDashboardAction } from '@Redux/dashboard/dashboardSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

export const ThirdCardDashboard = ({ data }) => {
    const dispatch = useDispatch();
    const [editNote, setEditNote] = useState(false);
    const [note, setNote] = useState(data.notes);
    const theme = useTheme();
    const colorProps = theme.palette.secondary.main;

    const handlechangeNote = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.dashboardApi.updateNote(note);

        if (result.result) {
            NotificationManager.success(
                'La note a bien été modifiée.',
                'Succès',
                Constant.REDIRECTION_TIME
            );

            dispatch(getDashboardAction());
        }
    };

    return (
        <>
            <Component.CmtCard overflow="hidden">
                <CardHeader
                    title="Informations générales"
                    titleTypographyProps={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: '#FFFFFF',
                    }}
                    sx={{
                        borderBottom: 1,
                        borderBottomColor: 'divider',
                        backgroundColor: colorProps,
                    }}
                />
                <CardContent sx={{ position: 'relative', p: 0 }}>
                    <List disablePadding>
                        {data.news?.map(({ title, date, desc, url }, index) => (
                            <ListItemButton
                                key={`${title}-${index}`}
                                component={'li'}
                                sx={{
                                    p: (theme) => theme.spacing(1, 5),
                                    borderBottom: 1,
                                    borderBottomColor: 'divider',

                                    '&:last-child': {
                                        borderBottomColor: 'transparent',
                                    },
                                }}
                            >
                                <Box display="flex" flexDirection="column" pb={2}>
                                    <Link href={url} underline="hover">
                                        <Typography>{title}</Typography>
                                    </Link>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Typography color="text.secondary" fontSize={12}>
                                            {moment(date).format('DD-MM-YYYY')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.secondary">
                                        {desc}
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        ))}
                    </List>
                </CardContent>
            </Component.CmtCard>
            <Component.CmtCard sx={{ marginTop: 4 }} overflow="hidden">
                <CardHeader
                    title="Notes"
                    titleTypographyProps={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: '#FFFFFF',
                    }}
                    sx={{
                        borderBottom: 1,
                        borderBottomColor: 'divider',
                        backgroundColor: colorProps,
                    }}
                />
                {data.notes && (
                    <Box sx={{ padding: 2 }}>
                        {editNote ? (
                            <Component.CmtTextField
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                multiline
                                rows={4}
                            />
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                {data.notes ||
                                    'Ceci est un espace dans lequel vous pouvez saisir vos notes pour ne rien oublier.'}
                            </Typography>
                        )}

                        <Box display="flex" justifyContent={'center'} sx={{ paddingTop: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (!editNote) {
                                        setNote(data.notes);
                                    }

                                    handlechangeNote();
                                    setEditNote(!editNote);
                                }}
                            >
                                {editNote ? 'Enregistrer' : 'Modifier'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Component.CmtCard>
        </>
    );
};
