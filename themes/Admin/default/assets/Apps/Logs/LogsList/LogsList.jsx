import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { useTheme } from '@emotion/react';

import { CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { loginFailure } from '@Redux/profile/profileSlice';

export const LogUserName = (item) => {
    return (
        <Box component="a" href={`${Constant.USER_BASE_PATH}/${item.user.id}${Constant.EDIT_PATH}`}>
            <Typography component="p" variant="body1">
                {item.user.lastName} {item.user.firstName}
            </Typography>
        </Box>
    );
};

export const LogTags = (item) => {
    const statusTheme = useTheme().palette.status;
    const key = item.severity;

    const severityList = [
        {
            bgColor: statusTheme.info.backgroundColor,
            color: statusTheme.info.textColor,
            text: 'Information',
        },
        {
            bgColor: statusTheme.warning.backgroundColor,
            color: statusTheme.warning.textColor,
            text: 'Avertissement',
        },
        {
            bgColor: statusTheme.error.backgroundColor,
            color: statusTheme.error.textColor,
            text: 'Erreur',
        },
        {
            bgColor: statusTheme.critical.backgroundColor,
            color: statusTheme.critical.textColor,
            text: 'Critique',
        },
    ];

    if ((!key && key !== 0) || key > severityList.length) {
        return <></>;
    }

    const severity = severityList[key];

    return (
        <Typography
            sx={{
                color: severity.color,
                backgroundColor: severity.bgColor,
                padding: '5px',
                borderRadius: '4px',
            }}
            component="span"
            variant="body1"
        >
            {severity.text}
        </Typography>
    );
};

const TABLE_COLUMN = [
    { label: 'Sévérité', renderFunction: LogTags },
    { name: 'errorCode', label: "Code d'erreur" },
    { name: 'message', label: 'Message', width: '40%' },
    { name: 'objectName', label: 'Objet' },
    { name: 'objectId', label: "Id de l'objet" },
    { label: 'Utilisateur', renderFunction: LogUserName },
];

export const LogsList = () => {
    const dispatch = useDispatch();
    const [logs, setLogs] = useState(null);

    const getLogs = async () => {
        const connect = await Api.authApi.checkIsAuth();

        if (!connect.result) {
            dispatch(loginFailure({ error: connect.error }));

            return;
        }

        const result = await Api.logsApi.getLogs();

        if (!result.result) {
            NotificationManager.error('Une erreur est survenue, vous pouvez tenter de rafraichir la page.', Constant.REDIRECTION_TIME);

            return;
        }

        setLogs(result.logs);
    };

    useEffect(() => {
        getLogs();
    }, []);

    return (
        <Component.CmtPageWrapper title={'Logs'}>
            <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between">
                        <Typography component="h2" variant="h5">
                            Liste des logs
                        </Typography>
                    </Box>

                    <Component.ListTable table={TABLE_COLUMN} list={logs} />
                </CardContent>
            </Component.CmtCard>
        </Component.CmtPageWrapper>
    );
};
