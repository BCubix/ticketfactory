import { Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from '@Components/Page/PageTitle/PageTitle';
import { PageWrapper } from '@Components/Page/PageWrapper/sc.PageWrapper';
import { usersSelector } from '@Redux/users/usersSlice';
import { getUsersAction } from '@Redux/users/usersSlice';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { CREATE_USER_PATH } from '../../../Constant';
import { useNavigate } from 'react-router-dom';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'firstName', label: 'Prénom' },
    { name: 'lastName', label: 'Nom' },
    { name: 'email', label: 'Adresse Email' },
];
export const UserList = () => {
    const { loading, users, error } = useSelector(usersSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !users && !error) {
            dispatch(getUsersAction());
        }
    }, []);

    return (
        <PageWrapper>
            <PageTitle>Utilisateurs</PageTitle>
            <Card sx={{ width: '100%', mt: 5 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between">
                        <Typography component="h2" variant="h5" fontSize={20}>
                            Employés (7)
                        </Typography>
                        <Button variant="contained" onClick={() => navigate(CREATE_USER_PATH)}>
                            Nouveau
                        </Button>
                    </Box>

                    <ListTable table={TABLE_COLUMN} list={users} />
                </CardContent>
            </Card>
        </PageWrapper>
    );
};
