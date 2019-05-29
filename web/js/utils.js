'use strict';


var Utils = (function($) {
    var module = {};

    var cssPrefixes = ['moz', 'webkit', 'o', 'ms'];

    module.css3 = function($el, rules) {
        var result = {};

        for (var pr in rules) {
            result[pr.replace('%s', '')] = rules[pr].replace('%s', '');
        }

        for (var i = 0; i < cssPrefixes.length; i++) {
            var prefix = '-' + cssPrefixes[i] + '-';
            for (var pr in rules) {
                result[pr.replace('%s', prefix)] = rules[pr].replace('%s', prefix);
            }
        }

        $el.css(result);
    };

    module.supportsCSSProp = function(p) {
        var b = document.body || document.documentElement;
        var s = b.style;

        if (typeof(s[p]) === 'string') {
            return true;
        }

        p = p.charAt(0).toUpperCase() + p.substr(1);

        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        for (var i = 0; i < v.length; i++) {
            if (typeof(s[v[i] + p]) === 'string') {
                return true;
            }
        }

        return false;
    }

    return module;
}(jQuery));
