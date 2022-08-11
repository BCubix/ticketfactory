import { Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CmtPageTitle } from '@Components/CmtPage/CmtPageTitle/CmtPageTitle';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useState } from 'react';
import { EDIT_PATH, REDIRECTION_TIME, USER_BASE_PATH } from '../../../Constant';
import logsApi from '../../../services/api/logsApi';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { NotificationManager } from 'react-notifications';

const userName = (item) => {
    return (
        <Box component="a" href={`${USER_BASE_PATH}/${item.user.id}${EDIT_PATH}`}>
            <Typography component="p" variant="body1">
                {item.user.lastName} {item.user.firstName}
            </Typography>
        </Box>
    );
};

const tags = (item) => {
    let color = '#000000';
    let bgColor = '';
    let text = '';

    switch (item.severity) {
        case 0:
            bgColor = '#0A9706';
            text = "Tout va bien, il n'y a aucun soucis";
            break;
        case 1:
            bgColor = '#D5E300';
            text = 'On commence à avoir un petit pépin, mais ca va encore';
            break;
        case 2:
            bgColor = '#DF0000';
            text = 'Là, on est dedans';
            break;
        case 3:
            bgColor = '#000000';
            text = 'Abandonnez tout éspoir';
            color = '#FFFFFF';
            break;
        default:
            break;
    }

    return (
        <Typography
            sx={{ color: color, backgroundColor: bgColor, padding: '5px' }}
            component="span"
            variant="body1"
        >
            {text}
        </Typography>
    );
};

const TABLE_COLUMN = [
    { label: 'Sévérité', renderFunction: tags },
    { name: 'errorCode', label: "Code d'erreur" },
    { name: 'message', label: 'Message', width: '40%' },
    { name: 'objectName', label: 'Objet' },
    { name: 'objectId', label: "Id de l'objet" },
    { label: 'Utilisateur', renderFunction: userName },
];

export const LogsList = () => {
    const dispatch = useDispatch();
    const [logs, setLogs] = useState(null);

    const getLogs = async () => {
        const connect = await authApi.checkIsAuth();

        if (!connect.result) {
            dispatch(loginFailure({ error: connect.error }));

            return;
        }

        const result = await logsApi.getLogs();

        if (!result.result) {
            NotificationManager.error(
                'Une erreur est survenue, vous pouvez tenter de rafraichir la page.',
                REDIRECTION_TIME
            );

            return;
        }

        setLogs(result.logs);
    };

    useEffect(() => {
        getLogs();
    }, []);

    return (
        <CmtPageWrapper>
            <CmtPageTitle>Logs</CmtPageTitle>
            <Card sx={{ width: '100%', mt: 5 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between">
                        <Typography component="h2" variant="h5" fontSize={20}>
                            Logs ({logs?.length})
                        </Typography>
                    </Box>

                    <ListTable table={TABLE_COLUMN} list={logs} />
                </CardContent>
            </Card>
        </CmtPageWrapper>
    );
};
