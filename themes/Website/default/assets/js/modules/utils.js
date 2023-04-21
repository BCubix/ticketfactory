let $ = require('jquery');

class Utils {
    constructor() {
        this.windowHeight = 0;
        this.windowWidth = 0;

        this.MQ = {
            xs: false,
            sm: false,
            md: false,
            lg: false,
            xl: false,
        };

        // Trigger a first resize for calculations
        this.resize();
    }

    resize() {
        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width();

        this.MQ = {
            xs: matchMedia('only screen and (min-width: 30em)').matches,
            sm: matchMedia('only screen and (min-width: 48em)').matches,
            md: matchMedia('only screen and (min-width: 64em)').matches,
            lg: matchMedia('only screen and (min-width: 80em)').matches,
            xl: matchMedia('only screen and (min-width: 100em)').matches,
        };
    }

    scroll() {
        
    }
}

export const utils = new Utils();
