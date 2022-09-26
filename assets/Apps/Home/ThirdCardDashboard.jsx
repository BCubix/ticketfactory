import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { Button, Card, CardContent, CardHeader, List, ListItem, Typography } from '@mui/material';

const ThirdCardDashboard = ({ data }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardContent>
                <List>
                    {data.news?.map(({ title, date, desc, url }, index) => (
                        <ListItem key={`${title}-${index}`}>
                            <Card variant='outlined'>
                                <CardContent>
                                    <Box display='flex' flexDirection='column'>
                                        <Button onClick={() => navigate(url)}>
                                            <CardHeader title={title} />
                                        </Button>
                                        <Box display='flex' justifyContent='flex-end'>
                                            <Typography color='text.secondary'>
                                                {date}
                                            </Typography>
                                        </Box>
                                        <Typography component='p' variant='body1' color='text.secondary'>
                                            {desc}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                    {data.notes && (
                        <ListItem key='notes'>
                            <Typography variant='body1' color='text.secondary'>
                                {data.notes}
                            </Typography>
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default ThirdCardDashboard;
