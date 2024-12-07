import React from 'react';
import { useSelector } from 'react-redux';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { notificationsSelector } from '../redux/notifications/notificationsSlice';
import { ProfileButton } from '@Components/Layout/sc.ProfileButton';

export const NotificationsList = () => {
    const { notifications } = useSelector(notificationsSelector);

    return (
        <>
            <ProfileButton size="small" sx={{ marginLeft: 3 }}>
                <NotificationsIcon />
            </ProfileButton>
        </>
    );
};
