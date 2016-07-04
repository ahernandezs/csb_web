'use strict';

angular.module('spaApp').service('detectIE', function() {
    /**
     * detect IE
     * returns true for any version of IE or false, if browser is not Internet Explorer
     */
    this.detect = function() {
        var ua = window.navigator.userAgent;

        // IE 10 or older
        var msie = ua.indexOf('MSIE ');
        if (msie > 0)
            return { 'ie' : true, 'version' : parseInt(ua.toLowerCase().split('msie')[1])};

        // IE 11
        var trident = ua.indexOf('Trident/');
        if (trident > 0)
            return { 'ie' : true, 'version' : 11 };

        // Edge
        var edge = ua.indexOf('Edge/');
        if (edge > 0)
            return { 'ie' : true, 'version' : 12 };

        // other browser
        return { 'ie' : false, 'version' : 0 };
    };

});
