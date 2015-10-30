'use strict';

angular.module('spaApp')
  .service('timerService', ['$rootScope', '$interval', function($rootScope, $interval) {
    var options = {
      idle: 540,
      warning: 30,
      idleTimer: null,
      warningTimer: null,
      isTimeout: false
    };

    this.idleDuration = function(value) {
      options.idle = value;
    };

    this.warningDuration = function(value) {
      options.warning = value;
    };

    this.start = function() {
      options.idleTimer = $interval(idleTimeout, options.idle * 1000, 1);
      options.isTimeout = false;
    };

    this.reset = function() {
      if(options.idleTimer && $interval.cancel(options.idleTimer)) {
        options.idleTimer = $interval(idleTimeout, options.idle * 1000, 1);
        $rootScope.$broadcast('IdleReset');
      }
      if(options.warningTimer && $interval.cancel(options.warningTimer)) {
        options.idleTimer = $interval(idleTimeout, options.idle * 1000, 1);
        $rootScope.$broadcast('IdleReset');
      }

    };

    this.stop = function() {
      stopTimers();
    };

    this.isTimeout = function() {
      return options.isTimeout;
    };

    this.setTimeout = function(value) {
      options.isTimeout = value;
    };

    function stopTimers() {
      if(options.idleTimer) {
        $interval.cancel(options.idleTimer);
      }
      if(options.warningTimer) {
        $interval.cancel(options.warningTimer);
      }

    }

    function idleTimeout() {
      $rootScope.$broadcast('IdleTimeout');

      options.warningTimer = $interval(warningTimeout, options.warning * 1000, 1);
    }

    function warningTimeout() {
      $rootScope.$broadcast('WarningTimeout');
      options.isTimeout = true;
    }
  }]);
