import React from 'react';
import { Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component'; 

import {ContentListBox} from './sc.Skeleton'

export const CmtSkeletonContentList = ({sidebarOpen, contentMargin, theme}) => {
    return (
        <>
            <ContentListBox contentMargin={contentMargin}>
                <Skeleton variant="rounded" height="40px" width="30%" />

                <Component.CmtFormBlock
                    title={<Skeleton variant="text" width="20%" />}
                    marginBlock={3}
                    paddingContent={3}
                >
                    <Box>
                        <Component.CmtSkeletonList></Component.CmtSkeletonList>
                    </Box>
                </Component.CmtFormBlock>
            </ContentListBox>
            {sidebarOpen && (
                <Box position="absolute" right={0} top={`${theme.layout.header.height}px`} bottom={0} width={contentMargin}>
                    <Skeleton variant="rectangular" height="100%" width="100%" />
                </Box>
            )}
            </>
        );
}