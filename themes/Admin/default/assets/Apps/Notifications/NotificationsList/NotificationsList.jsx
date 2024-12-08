import React, { useState } from 'react';
import moment from 'moment/moment';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, IconButton, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';

import { deleteNotificationAction, getNotificationsAction, notificationsSelector, readNotificationAction } from '../redux/notifications/notificationsSlice';

import { ProfileButton } from '@Components/Layout/sc.ProfileButton';
import { Crud } from '@/AdminService/Crud';
import { Constant } from '@/AdminService/Constant';

export const notificationsListCrud = {
    actionsList: {
        Page: ({ notification, navigate }) => navigate(`${Constant.PAGES_BASE_PATH}/${notification.objectId}${Constant.EDIT_PATH}`),
        Order: ({ notification, navigate }) => navigate(`${Constant.ORDERS_BASE_PATH}/${notification.objectId}`),
        Customer: ({ notification, navigate }) => navigate(`${Constant.CUSTOMERS_BASE_PATH}/${notification.objectId}${Constant.EDIT_PATH}`),
        ContactRequest: ({ notification, navigate }) => navigate(`${Constant.CONTACT_REQUEST_BASE_PATH}/${notification.objectId}${Constant.EDIT_PATH}`),
    },
};

export const NotificationsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, loading } = useSelector(notificationsSelector);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDelete = (notification) => {
        dispatch(deleteNotificationAction(notification));
    };

    const handleClick = (notification) => {
        if (!notification.readed) {
            dispatch(readNotificationAction(notification));
        }

        if (notification.type && Crud.notifications.list?.actionsList && Crud.notifications.list.actionsList[notification.type]) {
            Crud.notifications.list.actionsList[notification.type]({ notification, navigate });
            setAnchorEl(null);
        }
    };

    const loadMoreNotifications = () => {
        if (loading) {
            return;
        }

        dispatch(getNotificationsAction());
    };

    return (
        <>
            <ProfileButton size="small" sx={{ marginLeft: 3 }} onClick={(e) => setAnchorEl(e.currentTarget)} className="toolbar-profile-button">
                <NotificationsIcon />
            </ProfileButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{ marginTop: 1, maxHeight: 400 }}
            >
                <Box sx={{ width: '300px' }}>
                    <Typography variant="h2" className="notification_title">
                        Notifications
                    </Typography>
                    {notifications && notifications.length > 0 ? (
                        <List>
                            {notifications.map((item, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    onClick={() => {
                                        handleClick(item);
                                    }}
                                    className="notification_element"
                                >
                                    <ListItemText
                                        primary={item.title || 'Titre manquant'}
                                        secondary={item.description || 'Description manquante'}
                                        className={`notification_element_text ${item?.readed ? 'readed' : ''}`}
                                    />

                                    <Typography variant="body2" className="notification_element_date">
                                        {moment(item?.createdAt).format('DD/MM HH:mm')}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Aucune notification pour le moment.
                        </Typography>
                    )}
                    <Box className="flex row-center padding-3 cursor-pointer notification_load_wrapper" onClick={loadMoreNotifications}>
                        <Box className="flex relative">
                            <Typography variant="body2" color="textSecondary">
                                Voir plus
                            </Typography>
                            {loading && <CircularProgress color="inherit" className="notification_load_progress" />}
                        </Box>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};
