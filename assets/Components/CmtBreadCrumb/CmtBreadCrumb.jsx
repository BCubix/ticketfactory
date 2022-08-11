import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { StyledBreadCrumb } from './sc.StyledBreadCrumb';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const CmtBreadCrumb = ({ list }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            {list?.map((item, index) => (
                <StyledBreadCrumb
                    sx={{ py: 4, px: 2 }}
                    onClick={() => navigate(item.path)}
                    label={
                        <Typography variant="body1" sx={{ mt: '2px' }}>
                            {item?.label}
                        </Typography>
                    }
                    key={index}
                    icon={index === 0 && <HomeIcon fontSize="small" />}
                />
            ))}
        </Breadcrumbs>
    );
};
