import React, { useEffect } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Box, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Component } from '@/AdminService/Component';
import { milestonesSelector, milestonesAction } from '@Apps/Home/Milestones/redux/milestones/milestonesSlice';
import { getMilestonesAction } from './redux/milestones/milestonesSlice';

export const Milestones = () => {
    const { loading, milestones, error } = useSelector(milestonesSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loading && !milestones && !error) {
            dispatch(getMilestonesAction());
        }
    }, [dispatch, loading, milestones, error]);

  if (loading || !milestones)
  {
    return (<div>Chargement...</div>);
  }

  return (
    <Component.CmtCard>
      <Component.CmtCardHeader title="Succès" />
      <Box sx={{ padding: 2 }}>
        <Grid container>
          <Grid item xs={6} sx={{ borderRight: '1px solid #e0e0e0', paddingRight: 2 }}>
            <Timeline position="left">
              {milestones?.milestonesSales.map((milestone, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color={milestone.achieved ? 'success' : 'grey'} />
                    {index < milestones?.milestonesSales.length - 1 && (
                      <TimelineConnector
                        sx={{
                          backgroundColor:
                            milestone.achieved && milestones?.milestonesSales[index + 1].achieved
                              ? '#8DCD03'
                              : 'grey',
                        }}
                      />
                    )}
                  </TimelineSeparator>
                  <TimelineContent>{milestone.text}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Grid>
          <Grid item xs={6} sx={{ paddingLeft: 2 }}>
            <Timeline>
              {milestones?.milestonesClients.map((milestone, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color={milestone.achieved ? 'success' : 'grey'} />
                    {index < milestones?.milestonesClients.length - 1 && (
                      <TimelineConnector
                        sx={{
                          backgroundColor:
                            milestone.achieved && milestones?.milestonesClients[index + 1].achieved
                              ? '#8DCD03'
                              : 'grey',
                        }}
                      />
                    )}
                  </TimelineSeparator>
                  <TimelineContent>{milestone.text}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Grid>
        </Grid>
      </Box>
    </Component.CmtCard>
  );
};
