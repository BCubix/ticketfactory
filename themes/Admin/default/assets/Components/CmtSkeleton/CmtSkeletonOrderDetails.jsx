import React from 'react';
import { Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component'; 

import { ColoredSkeleton, StyledBox } from './sc.Skeleton'

export const CmtSkeletonOrderDetails = () => {
    return (
        <>
            <Box marginRight={`100px`} padding={8} height="100%">

                <StyledBox pb={20}>
                    <Skeleton variant="rounded" height="40px" width="20%"/>
                </StyledBox>

                <StyledBox display="flex" gap={15} alignItems="flex-start" >
                    <Component.CmtFormBlock
                        title={<Skeleton variant="text" width="20%" />}
                        marginBlock={3}
                        paddingContent={3}
                        sx={{ flex: 1 }}
                    >
                        <StyledBox display="flex" flexDirection="column" gap={3}>
                            {/* Random Skeletons */}
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="text" width="60%" />
                            <StyledBox pb={10}>
                                <Skeleton variant="text" width="50%" />
                            </StyledBox>
                        </StyledBox>
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock
                        title={<Skeleton variant="text" width="20%" />}
                        marginBlock={3}
                        paddingContent={3}
                        sx={{ flex: 1 }}
                    >
                        <StyledBox display="flex" flexDirection="column" gap={3}>
                            <Skeleton variant="text" width="40%" />
                            <StyledBox pb={10}>
                                <Skeleton variant="text" width="20%" />
                            </StyledBox>
                            
                        </StyledBox>
                    </Component.CmtFormBlock>
                </StyledBox>

                <Component.CmtFormBlock
                    title={<Skeleton variant="text" width="20%" />}
                    marginBlock={3}
                    paddingContent={2}
                >
                    <StyledBox pb={2}>
                        <ColoredSkeleton variant="rounded" width="100%" height={40} color={(theme) => theme.palette.primary.light} />
                    </StyledBox>
                    
                    <StyledBox pb={10}>
                        <ColoredSkeleton variant="rounded" width="100%" height={40} color={(theme) => theme.palette.primary.light} />
                    </StyledBox>
                </Component.CmtFormBlock>
            </Box>
            </>
        );
}