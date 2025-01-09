import React, { useState, useEffect } from 'react';

import { Component } from '@/AdminService/Component';

import { Button, Box, CardContent, Grid } from '@mui/material';

export const UpdatesList = () => {
    return (
        <div>
             <Component.CmtCard>
                <CardContent sx={{ padding: 0 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%" height={300}>
                        
                    </Box>
                </CardContent>
            </Component.CmtCard>
        </div>
    );
};

export default UpdatesList;
