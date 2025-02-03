import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Component } from '@/AdminService/Component';

export const ArticlesList = ({news}) => {
    return (
         <Component.CmtCard>
            <Component.CmtCardHeader title="Articles" />
            <Component.CmtImageCarousel data={news}/>
        </Component.CmtCard>
    );
};
