import React from 'react';
import { Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

import { ColoredSkeleton, StyledBox } from './sc.Skeleton';

export const CmtSkeletonForm = ({ formCrud, handleSubmit }) => {
    const fields = formCrud?.fields;

    const generateRandomSkeletons = () => {
        const skeletonCount = Math.floor(Math.random() * 11) + 4;
        const skeletonTypes = ['rectangular', 'text'];

        return Array.from({ length: skeletonCount }).map((_, index) => {
            const type = skeletonTypes[Math.floor(Math.random() * skeletonTypes.length)];
            const width = `${Math.floor(Math.random() * 70) + 20}%`;
            const height = type === 'rectangular' ? Math.floor(Math.random() * 50) + 20 : undefined;

            return <ColoredSkeleton key={index} variant={type} width={width} height={type === 'rectangular' ? height : undefined} color={(theme) => theme.palette.primary.light} />;
        });
    };

    return (
        <>
            <Component.CmtPageWrapper title={formCrud?.form?.title}>
                {/* Skeleton for the tabs bar */}
                {fields.length > 1 && (
                    <Box>
                        <ColoredSkeleton variant="rectangular" width="100%" height={40} color={(theme) => theme.palette.secondary.light} />
                    </Box>
                )}

                {/* Skeleton blocks for the first tab */}
                {[...Array(2)].map((_, index) => (
                    <Component.CmtFormBlock key={index} title={<Skeleton variant="text" width="20%" />} marginBlock={3} paddingContent={3}>
                        <StyledBox mt={3} display="flex" flexDirection="column" gap={12} pb={15}>
                            {/* Random Skeletons */}
                            {generateRandomSkeletons()}
                        </StyledBox>
                    </Component.CmtFormBlock>
                ))}
            </Component.CmtPageWrapper>
        </>
    );
};
