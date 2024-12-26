import React from 'react';

import { ColoredSkeleton, StyledBox } from './sc.Skeleton'
 
export const CmtSkeletonList = ({
    numberLines = 10,
}) => {
    return (
        <>
            {[...Array(numberLines)].map((_, index) => (
                <StyledBox key={index}  p={15}>
                    <ColoredSkeleton
                        variant="rounded"
                        width="100%"
                        height={40}
                        color={(theme) => theme.palette.primary.light}
                    />
                </StyledBox>
            ))}
    </>);
};