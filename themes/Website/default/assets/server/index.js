require('ignore-styles');
const path = require('path');

require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        [
            'babel-plugin-module-resolver/lib/index.js',
            {
                alias: {
                    '@Website': path.resolve(__dirname, '../'),
                    '@WApps': path.resolve(__dirname, '../Apps'),
                    '@WComponents': path.resolve(__dirname, '../Components'),
                    '@WServices': path.resolve(__dirname, '../services'),
                    '@WStyle': path.resolve(__dirname, '../Style'),
                },
            },
        ],
    ],
});

// Add context var passed from the HomeController into the global
// so that it can be accessed from the React Component global.
global.context = context;

require('./server.js');
