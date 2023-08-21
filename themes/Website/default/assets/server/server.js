import React from 'react';
import { renderToString } from 'react-dom/server';
import { Website } from '../Website';
import { StaticRouter } from 'react-router-dom/server';

const serverRenderer = () => {
    console.log(
        renderToString(
            <StaticRouter location={{ pathname: global.context.uri }}>
                <Website />
            </StaticRouter>
        )
    );
};

serverRenderer();
