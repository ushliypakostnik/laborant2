'use strict';


var Logger = function(options) {
    options = options || {};

    this.options = {
        debug: 0,
        moduleName: ''
    };

    for (var pr in options) {
        this.options[pr] = options[pr];
    }
};


Logger.prototype.log = function() {
    if (this.options.debug) {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        args.unshift(this.options.moduleName);

        try {
            console.log.apply(console, args);
        } catch (e) {}
    }
};
