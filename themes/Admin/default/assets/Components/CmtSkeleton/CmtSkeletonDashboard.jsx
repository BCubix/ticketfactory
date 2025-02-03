import React from 'react';
import { Grid } from '@mui/material';
import { ColoredSkeleton, StyledBox } from './sc.Skeleton';

export const CmtSkeletonDashboard = () => {
  return (
    <Grid container spacing={6} style={{ marginTop: '20px' }}>
      <Grid item xs={12}>
        <ColoredSkeleton variant="rounded" width="100%" height={40} color={(theme) => theme.palette.primary.light} />
      </Grid>

      <Grid item xs={12}>
        <ColoredSkeleton variant="rounded" width="100%" height={40} color={(theme) => theme.palette.primary.light} />
      </Grid>

      <Grid item xs={12} md={5}>
        <ColoredSkeleton variant="rounded" width="100%" height={200} color={(theme) => theme.palette.primary.light} />
      </Grid>

      <Grid item xs={12} md={7}>
        <ColoredSkeleton variant="rounded" width="100%" height={200} color={(theme) => theme.palette.primary.light} />
      </Grid>

      <Grid item xs={12}>
        <ColoredSkeleton variant="rounded" width="100%" height={200} color={(theme) => theme.palette.primary.light} />
      </Grid>

      <Grid item xs={12} md={6}>
        <ColoredSkeleton variant="rounded" width="100%" height={200} color={(theme) => theme.palette.primary.light} />
      </Grid>

      <Grid item xs={12} md={6}>
        <ColoredSkeleton variant="rounded" width="100%" height={200} color={(theme) => theme.palette.primary.light} />
      </Grid>

    </Grid>
  );
};
