import React from 'react';
import { Box } from '@mui/system';
import { Card, CardContent, CardHeader, Link, List, ListItem, Typography } from '@mui/material';

const ThirdCardDashboard = ({ data }) => {
    return (
        <Card>
            <CardContent>
                <List>
                    {data.news?.map(({ title, date, desc, url }, index) => (
                        <ListItem key={`${title}-${index}`}>
                            <Card variant='outlined'>
                                <CardContent>
                                    <Box display='flex' flexDirection='column'>
                                        <Link href={url} underline="hover">
                                            <CardHeader title={title} />
                                        </Link>
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
