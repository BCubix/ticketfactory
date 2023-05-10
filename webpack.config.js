// <<< Variables
const adminThemeName = 'default';
const websiteThemeName = 'default';
// >>> Variables

var Encore = require('@symfony/webpack-encore');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    .enableReactPreset()
    .enableSassLoader();

// only needed for CDN's or sub-directory deploy
//.setManifestKeyPrefix('build/')
/*
 * ENTRY CONFIG
 *
 * Add 1 entry for each "page" of your app
 * (including one that's included on every page - e.g. "app")
 *
 * Each entry will result in one JavaScript file (e.g. app.js)
 * and one CSS file (e.g. app.css) if you JavaScript imports CSS.
 */
if (adminThemeName) {
    Encore.addEntry('admin', `./themes/Admin/${adminThemeName}/assets/index.js`).addAliases({
        '@': path.resolve(__dirname, `themes/Admin/${adminThemeName}/assets`),
        '@Apps': path.resolve(__dirname, `themes/Admin/${adminThemeName}/assets/Apps`),
        '@Components': path.resolve(__dirname, `themes/Admin/${adminThemeName}/assets/Components`),
        '@Redux': path.resolve(__dirname, `themes/Admin/${adminThemeName}/assets/redux`),
        '@Services': path.resolve(__dirname, `themes/Admin/${adminThemeName}/assets/services`),
        '@Style': path.resolve(__dirname, `themes/Admin/${adminThemeName}/assets/Style`),
    });
}

if (websiteThemeName) {
    Encore.addEntry('app', `./themes/Website/${websiteThemeName}/assets/index.js`).addAliases({
        '@Website': path.resolve(__dirname, `themes/Website/${websiteThemeName}/assets`),
        '@WApps': path.resolve(__dirname, `themes/Website/${websiteThemeName}/assets/Apps`),
        '@WComponents': path.resolve(__dirname, `themes/Website/${websiteThemeName}/assets/Components`),
        '@WServices': path.resolve(__dirname, `themes/Website/${websiteThemeName}/assets/services`),
        '@WStyle': path.resolve(__dirname, `themes/Website/${websiteThemeName}/assets/Style`),
    });
}

Encore
    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // enables @babel/preset-env polyfills
    .configureBabel(() => {}, {
        useBuiltIns: 'usage',
        corejs: 3,
    })

    .configureDefinePlugin((options) => {
        const env = dotenv.config().parsed;
        if (env.error) {
            throw env.error;
        }
        options['process'] = {};
        options['process.env'] = {};
        // Get the root path.
        const currentPath = path.join(__dirname);
        // Create fallback path.
        const basePath = currentPath + '/.env';
        // Add the correct environment in path.
        const envPath = currentPath + '/.env.local';
        // Check if the specified environment file exists.
        const finalPath = fs.existsSync(envPath) ? envPath : basePath;
        // Set the path parameter in the dotenv config.
        const fileEnv = dotenv.config({ path: finalPath }).parsed;
        // Finally add env vars.
        for (const property in fileEnv) {
            // Filter env vars by prefix to avoid passing sensitive symfony variables to front,
            // assuming  related vars are prefixed with REACT_APP_.
            if (property.substr(0, 10) === 'REACT_APP_') {
                options['process.env'][property] = JSON.stringify(fileEnv[property]);
            }
        }
    })
    .copyFiles({
        from: 'node_modules/tinymce/skins',
        to: 'skins/[path][name].[ext]',
    })
    .copyFiles({
        from: 'node_modules/tinymce/icons',
        to: 'icons/[path][name].[ext]',
    });

module.exports = Encore.getWebpackConfig();
