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
        }

        setupHash() {
            if(window.location.hash) {
                this.scrollTo($('#' + window.location.hash.substr(2)));
            }
        }
    }

    new App();
})();
