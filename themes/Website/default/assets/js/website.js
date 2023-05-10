// Import vendors
import $ from 'jquery';

// Import modules
import { utils } from './modules/utils';

// Load SCSS
import '../scss/website.scss';

(() => {
    class App {
        constructor() {
            $(document).ready(() => this.init());
            $(window).resize(() => utils.resize());
            $(window).scroll(() => utils.scroll());
            $(document).bind('touchmove MSPointerMove pointermove', () => utils.scroll());
        }

        init() {
            this.setupHash();
            this.setupModules();
        }

        setupHash() {
            if (window.location.hash) {
                this.scrollTo($('#' + window.location.hash.substr(2)));
            }
        }

        setupModules() {
            const modulesName = $('.initScript').data('modules');
            if (!modulesName) {
                return;
            }

            const modulesList = modulesName.split(',');
            if (!modulesList || modulesList.length === 0) {
                return;
            }

            const list = require.context(`@/../../../../modules`, true, /\.*\/assets\/Website\/index.js$/);

            list.keys().map((item) => {
                const arrayPath = item.split('/');
                if (!arrayPath || arrayPath.length < 1) return;

                const moduleName = arrayPath[1];

                if (modulesList.find((moduleActive) => moduleActive === moduleName)) {
                    const func = list(item).default;

                    if (typeof func === 'function') {
                        func();
                    }
                }
            });
        }
    }

    new App();
})();
