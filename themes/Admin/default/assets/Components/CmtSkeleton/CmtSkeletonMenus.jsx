import React from 'react';

import { Component } from '@/AdminService/Component';
import { Skeleton, CardContent } from '@mui/material';

import { ColoredSkeleton, StyledBox } from './sc.Skeleton'
 
export const CmtSkeletonMenus = ({ formCrud, handleSubmit }) => {

    const getRandomWidth = () => `${Math.floor(Math.random() * (50 - 20 + 1)) + 20}%`;

    return (
        <>
            <Component.CmtPageWrapper
                component="form"
                noValidate
                onSubmit={handleSubmit}
                title={formCrud?.form?.title}
            >
                <Component.CmtCard className="menus-header">
                    <CardContent>
                        <Skeleton
                            variant="text"
                            width="40%"
                        />
                    </CardContent>
                </Component.CmtCard>

                <StyledBox display="flex" gap={4} alignItems="flex-start" mt="30px">

                    <StyledBox
                        width="50%"
                        flex={1}
                        backgroundColor="white"
                        p={15}
                        borderRadius={1}
                    >
                        
                        {Array.from({ length: 8 }).map((_, index) => (
                            <StyledBox key={index} mb={15}>
                                <Skeleton variant="text" width={getRandomWidth()}/>
                            </StyledBox>
                        ))}
                    </StyledBox>

                    <StyledBox flex={2} gap={5} p={10} display="flex" flexDirection="column">
                        <ColoredSkeleton variant="text" width="40%"/>
                        <ColoredSkeleton variant="text" width="100%"/>
                    </StyledBox>

                </StyledBox>

                            
            </Component.CmtPageWrapper>
        </>
    );
};