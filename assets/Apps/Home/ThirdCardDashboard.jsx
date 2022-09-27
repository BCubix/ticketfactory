import React from 'react';
import { Box } from '@mui/system';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Link,
    List,
    ListItem,
    ListItemButton,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { CmtTextField } from '../../Components/CmtTextField/CmtTextField';
import authApi from '../../services/api/authApi';
import { useDispatch } from 'react-redux';
import { loginFailure } from '../../redux/profile/profileSlice';
import { getDashboardAction } from '../../redux/dashboard/dashboardSlice';
import dashboardApi from '../../services/api/dashboardApi';

const ThirdCardDashboard = ({ data }) => {
    const dispatch = useDispatch();
    const [editNote, setEditNote] = useState(false);
    const [note, setNote] = useState(data.notes);
    const colorProps = '#02374D';

    const handlechangeNote = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await dashboardApi.updateNote(note);

        if (result.result) {
            NotificationManager.success('La note à bien été modifié.', 'Succès', REDIRECTION_TIME);

            dispatch(getDashboardAction());
        }
    };

    return (
        <>
            <Card>
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
                                            {date}
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
            </Card>
            <Card sx={{ marginTop: 4 }}>
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
                            <CmtTextField
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
            </Card>
        </>
    );
};

export default ThirdCardDashboard;
